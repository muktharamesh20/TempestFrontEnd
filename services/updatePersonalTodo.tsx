/* eslint-disable no-implicit-globals */
import { Database } from '@/databasetypes';
import { SupabaseClient } from '@supabase/supabase-js';
import assert from 'assert';
import { addDays, addMonths, addYears, differenceInCalendarDays, parseISO } from 'date-fns';
import * as types from './utils.js';

/** ---------- Helpers ---------- **/

// True UTC midnight ISO (YYYY-MM-DDT00:00:00.000Z)
function toUtcMidnightIso(dateLike: string): string {
  const d = parseISO(dateLike);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

// Convert an ISO (or date) to a Date object (preserve time)
function toDate(iso: string | Date): Date {
  return typeof iso === 'string' ? parseISO(iso) : iso;
}

/**
 * Basic recurrence expansion for TodoDetails.
 * Returns array of Date objects representing the occurrence start times.
 * NOTE: Assumes previous.start_date and previous.end_repeat are non-null strings when repeating.
 */
function generateTodoOccurrences(todo:  types.TodoDetails): Date[] {
  const occurrences: Date[] = [];

  if (!todo.start_date) return occurrences;

  const startDate = new Date(todo.start_date);
  const endRepeat = todo.end_repeat ? new Date(todo.end_repeat) : startDate;
  const repeat = todo.repeat_every || 'none';

  // Helper: push occurrence if between start and endRepeat
  const pushIfInRange = (d: Date) => {
    if (d >= startDate && d <= endRepeat) occurrences.push(new Date(d));
  };

  if (repeat === 'none') {
    pushIfInRange(startDate);
    return occurrences;
  }

  if (repeat === 'daily') {
    for (let d = new Date(startDate); d <= endRepeat; d = addDays(d, 1)) pushIfInRange(d);
    return occurrences;
  }

  if (repeat === 'weekly' || repeat === 'biweekly') {
    const step = repeat === 'weekly' ? 7 : 14;
    // weekdays stored as number[] (0 = Sun ... 6 = Sat)
    const weekdays = todo.weekdays ?? [];
    // iterate days from startDate -> endRepeat
    for (let d = new Date(startDate); d <= endRepeat; d = addDays(d, 1)) {
      if (weekdays.includes(d.getDay())) {
        // check alignment to biweekly relative to startDate (for biweekly only)
        if (repeat === 'biweekly') {
          const daysDiff = differenceInCalendarDays(d, startDate);
          if (Math.floor(daysDiff / 7) % 2 === 0) occurrences.push(new Date(d));
        } else {
          occurrences.push(new Date(d));
        }
      }
    }
    return occurrences;
  }

  if (repeat === 'monthly') {
    let cursor = new Date(startDate);
    while (cursor <= endRepeat) {
      pushIfInRange(cursor);
      cursor = addMonths(cursor, 1);
      // keep the same day-of-month where possible
      const day = Math.min(startDate.getDate(), new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate());
      cursor.setDate(day);
    }
    return occurrences;
  }

  if (repeat === 'yearly') {
    let cursor = new Date(startDate);
    while (cursor <= endRepeat) {
      pushIfInRange(cursor);
      cursor = addYears(cursor, 1);
    }
    return occurrences;
  }

  return occurrences;
}

// Map override field -> masterTodo field to compare for "revert to master" logic
function masterTodoFieldEquivalent(field: keyof types.ModifiedTodoDetails, master: types.TodoDetails): unknown {
  const mapping: Partial<Record<keyof types.ModifiedTodoDetails, keyof types.TodoDetails>> = {
    title_override: 'title',
    due_time_override: 'deadline',
    location_override: 'notes',
    priority_color_overridden: 'priority',
    weekdays_override: 'weekdays',
    repeitition_override: 'repeat_every',
    // add more mapping entries if you have more override fields that map to master
  };

  const mapped = mapping[field];
  return mapped ? (master as any)[mapped] : null;
}

/** Merge previous master todo + updates to create new master for inserts.
 *  This is a conservative merge — prefer override values when provided.
 */
function combineModificationsWithPrevious(previous: types.TodoDetails, updates: Partial<types.ModifiedTodoDetails>): types.TodoDetails {
  const newTodo: types.TodoDetails = { ...previous };

  if (updates.title_override !== undefined && updates.title_override !== null) newTodo.title = updates.title_override;
  if (updates.due_time_override !== undefined && updates.due_time_override !== null) newTodo.deadline = updates.due_time_override;
  if (updates.location_override !== undefined && updates.location_override !== null) newTodo.notes = updates.location_override;
  if (updates.priority_color_overridden !== undefined && updates.priority_color_overridden !== null) newTodo.priority = updates.priority_color_overridden;
  if (updates.weekdays_override !== undefined && updates.weekdays_override !== null) newTodo.weekdays = updates.weekdays_override;
  if (updates.repeitition_override !== undefined && updates.repeitition_override !== null) newTodo.repeat_every = updates.repeitition_override;
  // also handle other logical mappings as needed

  return newTodo;
}

/** ---------- Core override helper ---------- **/

/**
 * Insert or update overrides for the provided UTC-midnight ISO dates.
 *
 * rules:
 * - If row doesn't exist -> insert a new override containing only changed fields.
 * - If exists -> only update fields provided in "updates":
 *     - if updates[field] === masterEquivalent => set null (revert to master)
 *     - else -> set to new value
 * - Skip any occurrence that is completed (override.completed_at not null) unless allowCompletedOverride = true (only allowed for target === 'today')
 */
async function applyPartialOverridesForDates(
  masterTodo: types.TodoDetails,
  updates: Partial<types.ModifiedTodoDetails>,
  utcDates: string[], // array of YYYY-MM-DDT00:00:00.000Z
  supabase: SupabaseClient<Database>,
  allowCompletedOverride = false
): Promise<void> {
  if (utcDates.length === 0) return;

  // Fetch existing overrides for those dates
  const { data: existingData, error: fetchError } = await supabase
    .from('todo_overrides')
    .select('*')
    .in('utc_start_of_day', utcDates)
    .eq('parent_id', masterTodo.id);

  if (fetchError) throw fetchError;
  const existingOverrides = (existingData ?? []) as types.ModifiedTodoDetails[];

  const mapByDate = new Map<string, types.ModifiedTodoDetails>();
  for (const o of existingOverrides) mapByDate.set(o.utc_start_of_day, o);

  const inserts: Partial<types.ModifiedTodoDetails>[] = [];
  const updatesList: { my_id: string; fields: Partial<types.ModifiedTodoDetails> }[] = [];

  for (const date of utcDates) {
    const existing = mapByDate.get(date);

    // skip completed unless allowed
    if (existing?.completed_at && !allowCompletedOverride) continue;

    if (!existing) {
      // create new override containing only changed fields (and set parent/utc)
      const newOverride: Partial<types.ModifiedTodoDetails> = {
        parent_id: masterTodo.id,
        utc_start_of_day: date,
      };

      for (const field in updates) {
        const val = updates[field as keyof typeof updates];
        const masterVal = masterTodoFieldEquivalent(field as keyof types.ModifiedTodoDetails, masterTodo);

        // If new value equals master => set null (so it falls back), otherwise use provided
        if (val === masterVal) {
          // store null explicitly to indicate fallback to master
          (newOverride as any)[field] = null;
        } else {
          (newOverride as any)[field] = val;
        }
      }

      inserts.push(newOverride);
    } else {
      // modify only fields in updates and only if changes are needed
      const payload: Partial<types.ModifiedTodoDetails> = {};

      for (const field in updates) {
        const newVal = updates[field as keyof typeof updates];
        const masterVal = masterTodoFieldEquivalent(field as keyof types.ModifiedTodoDetails, masterTodo);
        const currentOverrideVal = (existing as any)[field];

        if (newVal === masterVal) {
          // revert to master => set to null unless already null
          if (currentOverrideVal !== null) payload[field as keyof types.ModifiedTodoDetails] = undefined;
        } else {
          // change only if differs from current override
          if (currentOverrideVal !== newVal) payload[field as keyof types.ModifiedTodoDetails] = newVal as any;
        }
      }

      if (Object.keys(payload).length > 0) {
        updatesList.push({ my_id: existing.my_id, fields: payload });
      }
    }
  }

  // commit inserts
  if (inserts.length > 0) {
    const { error: insertError } = await supabase
      .from('todo_overrides')
      .insert(
        inserts.map(insert => ({
          ...insert,
          utc_start_of_day: insert.utc_start_of_day ?? assert.fail('utc_start_of_day should not be null'),
        }))
      );
    if (insertError) throw insertError;
  }

  // commit per-row updates
  for (const u of updatesList) {
    const { error: updateError } = await supabase
      .from('todo_overrides')
      .update(u.fields)
      .eq('my_id', u.my_id);
    if (updateError) throw updateError;
  }
}

/** ---------- Main updatePersonalTodo ---------- **/

export async function updatePersonalTodoFile(
  todoId: string,
  utc_start_of_day: string,
  target: 'today' | 'future' | 'all',
  previous: types.TodoDetails,
  updates: Partial<types.ModifiedTodoDetails>,
  supabaseClient: SupabaseClient<Database>,
  newCategories: types.CategoryId[] // used for category-related logic (not fully implemented here)
): Promise<void> {
  // normalize the provided utc_start_of_day to true UTC midnight
  const utcMidnight = toUtcMidnightIso(utc_start_of_day);

  // Expand occurrences for the master todo
  const allOccurrences = generateTodoOccurrences(previous)
    .map(d => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString());

  // helper to pick occurrences depending on target
  let affectedDates: string[] = [];
  if (target === 'today') {
    affectedDates = [utcMidnight];
  } else if (target === 'future') {
    affectedDates = allOccurrences.filter(d => d >= utcMidnight);
  } else if (target === 'all') {
    affectedDates = allOccurrences.slice(); // all occurrences
  } else {
    throw new Error('invalid target');
  }

  // === TARGET: TODAY ===
  if (target === 'today') {
    // For today allow overriding completed occurrences
    await applyPartialOverridesForDates(previous, updates, affectedDates, supabaseClient, true);
    return;
  }

  // === TARGET: FUTURE ===
  if (target === 'future') {
    const repeatingChanged = updates.repeitition_override !== undefined || updates.weekdays_override !== undefined;

    if (repeatingChanged) {
      // 1) split: update existing todo to end before utcMidnight
      const { error: endErr } = await supabaseClient
        .from('todo')
        .update({ ...previous, end_repeat: utcMidnight })
        .eq('id', todoId)
        .is('completed_by', null); // don't touch completed master row (safety)
      if (endErr) throw endErr;

      // 2) create new todo starting at utcMidnight with merged fields
      const newTodo = combineModificationsWithPrevious(previous, updates);
      newTodo.start_date = utcMidnight;
      newTodo.end_repeat = previous.end_repeat; // carry forward the original end-repeat
      // create new row
      const { data: insertData, error: insertErr } = await supabaseClient
        .from('todo')
        .insert(newTodo)
        .select()
        .maybeSingle();
      if (insertErr) throw insertErr;
      const created = insertData as types.TodoDetails;

      // 3) For all future overrides (>= utcMidnight), we want them to fall through to the new master.
      //    That means setting override fields to null for fields in `updates`.
      const futureDates = allOccurrences.filter(d => d >= utcMidnight);
      // Build a "nullify" updates object: set each override field to null so it falls back to master
      const nullify: Partial<types.ModifiedTodoDetails> = {} ;
      for (const k of Object.keys(updates)) {
        (nullify as any)[k] = null;
      }
      await applyPartialOverridesForDates(previous, nullify, futureDates, supabaseClient, /*allowCompletedOverride*/false);

      return;
    } else {
      // Not changing repeat rules: just apply partial overrides for dates >= utcMidnight
      await applyPartialOverridesForDates(previous, updates, affectedDates, supabaseClient, /*allowCompletedOverride*/false);
      return;
    }
  }

  // === TARGET: ALL ===
  // 1) update the master todo row (only change fields that map from ModifiedTodoDetails)
  const mergedMaster = combineModificationsWithPrevious(previous, updates);
  const { error: masterUpdateError } = await supabaseClient
    .from('todo')
    .update(mergedMaster)
    .eq('id', todoId)
    .is('completed_by', null); // do not alter master if it's completed (safety)
  if (masterUpdateError) throw masterUpdateError;

  // 2) For *all existing* overrides for this todo, set changed fields to null (so they follow the new master).
  //    We do not create new overrides for dates that didn't have them before when target === 'all'.
  //    We must be careful not to change overrides that are completed.
  // Fetch all existing overrides for this master
  const { data: allOverrides, error: ovFetchErr } = await supabaseClient
    .from('todo_overrides')
    .select('*')
    .eq('parent_id', todoId);
  if (ovFetchErr) throw ovFetchErr;
  const existing = (allOverrides ?? []) as types.ModifiedTodoDetails[];

  // Build per-row updates
  for (const o of existing) {
    if (o.completed_at) continue; // skip completed
    const payload: Partial<types.ModifiedTodoDetails> = {};
    for (const field in updates) {
      // set to null to revert to master
      payload[field as keyof types.ModifiedTodoDetails] = undefined;  //////////////////////////////COME BACK TO
    }
    if (Object.keys(payload).length > 0) {
      const { error: updErr } = await supabaseClient
        .from('todo_overrides')
        .update(payload)
        .eq('my_id', o.my_id);
      if (updErr) throw updErr;
    }
  }

  return;
}
