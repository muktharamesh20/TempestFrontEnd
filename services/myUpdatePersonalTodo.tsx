/* eslint-disable no-implicit-globals */
import { supabase } from '@/constants/supabaseClient.js';
import { Database } from '@/databasetypes';
import { SupabaseClient } from '@supabase/supabase-js';
import assert from 'assert';
import { parseISO } from 'date-fns';
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

/**
 * Creates a modified subtodo given the subtodo + the modified master todo.
 * 
 * @param subtodo Subtodo object to convert
 * @returns the modified subtodo details without ID
 */
function convertSubTodoToModified(subtodo: types.SubtodoDetails, modifiedMasterId: string): types.ModifiedSubTodoDetailsNoID {
  const result: types.ModifiedSubTodoDetailsNoID = {
    overridden_todo: modifiedMasterId,
    location: subtodo.location,
    priority: subtodo.priority,
    title: subtodo.title,
    deadline: subtodo.deadline,
  };

  return result;
}

/**
 * cannot change "all group memebers must complete todo" for a modified todo, the user must create a new todo instead
 * 
 * Insert the same todo in newTodo IF you are only changing the subtodos, categories, and/or some state
 */
function createInitialModifiedTodoDetailsNoID(
  todo: types.TodoDetails,
  newTodo: types.TodoDetails,
  instance_deadline: string,

  otherModifications: {subtodosOverridden: boolean, categoriesOverridden: boolean, },
  stateChanges: {completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean},
): types.ModifiedTodoDetailsNoID {
  return {
    parent_id: todo.id,
    utc_start_of_day: toUtcMidnightIso(instance_deadline),
    title_override: todo.title !== newTodo.title ? newTodo.title : null,
    due_time_override: instance_deadline !== newTodo.deadline ? newTodo.deadline : null,
    location_override: todo.location !== newTodo.location ? newTodo.location : null,
    priority_color_overridden: todo.priority !== newTodo.priority ? newTodo.priority : null,
    weekdays_override: todo.weekdays.sort().join('') !== newTodo.weekdays.sort().join('') ? newTodo.weekdays : null,
    privacy_overridden: todo.privacy !== newTodo.privacy ? newTodo.priority : null,
    repeitition_override: todo.repeat_every !== newTodo.repeat_every ? newTodo.repeat_every : null,

    // state changes
    completed_at: stateChanges.completed ? new Date(Date.now()).toISOString() : null, 
    all_group_members_todo_started: stateChanges.allGroupMembersTodoStarted, 
    started_subtodos: stateChanges.startedSubtodos,
    deleted_override: stateChanges.deletedTodo, 

    // subtodo/category mdofications
    subtodos_overriden: otherModifications.subtodosOverridden, 
    categories_override: otherModifications.categoriesOverridden,
  };
}

function changeSingularModifiedTodoDetails(
  masterTodo: types.TodoDetails,
  modifiedTodo: types.ModifiedTodoDetails,
  newTodo: types.TodoDetails,
  // instance_deadline: string, this is misleading now cuz it could have been different before changing the deadline

  otherModifications: {subtodosOverridden: boolean, categoriesOverridden: boolean, },
  stateChanges: {completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean},
): types.ModifiedTodoDetails {

  if (stateChanges.deletedTodo && !modifiedTodo.deleted_override) {
    // if the todo is deleted, we should not have any overrides (we gain back space in our database basically)
    deleteSubtodoOverridesForModifiedTodos([modifiedTodo], supabase); 
    deleteTodoImageFromMemory(modifiedTodo);
    deleteCategoryOverridesForDate([modifiedTodo], supabase); 
  }

  return {
    parent_id: masterTodo.id === modifiedTodo.parent_id ? modifiedTodo.parent_id : assert.fail('parent_id should match masterTodo.id'),
    my_id: modifiedTodo.my_id, // keep the same ID
    utc_start_of_day: modifiedTodo.utc_start_of_day,
    title_override: newTodo.title !== masterTodo.title ? newTodo.title : null,
    due_time_override: newTodo.deadline !== masterTodo.deadline ? newTodo.deadline : null,
    location_override: newTodo.notes !== masterTodo.notes ? newTodo.notes : null,
    priority_color_overridden: newTodo.priority !== masterTodo.priority ? newTodo.priority : null,
    weekdays_override: newTodo.weekdays.sort().join('') !== masterTodo.weekdays.sort().join('') ? newTodo.weekdays : null,
    privacy_overridden: newTodo.privacy !== masterTodo.privacy ? newTodo.privacy : null,
    repeitition_override: newTodo.repeat_every !== masterTodo.repeat_every ? newTodo.repeat_every : null,

    // state changes
    completed_at: stateChanges.completed ? new Date(Date.now()).toISOString() : modifiedTodo.completed_at, 
    all_group_members_todo_started: stateChanges.allGroupMembersTodoStarted ? true : modifiedTodo.all_group_members_todo_started, // cannot revert all_group_members_todo_started to false
    started_subtodos: stateChanges.startedSubtodos ? true : modifiedTodo.started_subtodos, // cannot revert started_subtodos to false
    deleted_override: stateChanges.deletedTodo ? true : modifiedTodo.deleted_override, // cannot revert deleted_override to false

    // subtodo/category mdofications
    subtodos_overriden: otherModifications.subtodosOverridden, 
    categories_override: otherModifications.categoriesOverridden,
  };
}

function deleteTodoImageFromMemory(modifiedTodo: types.ModifiedTodoDetails): void {
  // If the modified todo has an image, delete it from memory
  throw new Error('deleteTodoImageFromMemory is not implemented yet');
}

function deleteSubtodoImageFromMemory(modifiedSubTodo: types.ModifiedSubTodoDetails): void {
  // If the modified todo has an image, delete it from memory
  throw new Error('deleteTodoImageFromMemory is not implemented yet');
}

/**
 * Reverts a specific field for all modified todos back to the master todo.
 * DO NOT USE FOR STATE CHANGES (eg. completed_at, all_group_members_todo_started, etc.)!
 * CAN USE FOR SUBTODO/CATEGORY REVERT TO MASTERS!!  
 * 
 * ----------------Warning: reverting subtodos WILL delete all completed subtodos----------------
 * Reverting categories may also affect the privacy settings of the todo.
 * 
 * @param modifiedTodos the todos to revert back to the master
 * @param field the fields to revert
 * @returns a new array of modified todos with the specified fields set to null (reverted to master)
 */
function removeAnOverriddenFieldForAllModifiedTodods(
  modifiedTodos: types.ModifiedTodoDetails[],
  field: (keyof types.ModifiedTodoDetails)[]
): types.ModifiedTodoDetails[] {
  if (field.length === 0) return modifiedTodos;

  //removes "completed_at", "started_subtodos", "deleted_override" and "all_group_members_todo_started" from the modified todos
  if (field.some(f => ['completed_at', 'started_subtodos', 'deleted_override', 'all_group_members_todo_started'].includes(f))) {
    throw new Error('Cannot revert state changes like completed_at, started_subtodos, deleted_override, or all_group_members_todo_started');
  }

  // remove the field from all modified todos
  if (field.some(f => ['subtodos_overriden', 'categories_override'].includes(f))) {
    if ('subtodos_overriden' in field) {
      field = field.filter(f => f !== 'subtodos_overriden');
      deleteSubtodoOverridesForModifiedTodos(modifiedTodos, supabase); // delete all subtodo overrides for these modified todos
    }
    if('categories_override' in field) {
      field = field.filter(f => f !== 'categories_override');
      deleteCategoryOverridesForDate(modifiedTodos, supabase); // delete all category overrides for these modified todos
    }
  }

  return modifiedTodos.map(modified => {
    const newModified: types.ModifiedTodoDetails = { ...modified };
    for (const f of field) {
      if (newModified[f] !== null) {
        (newModified as any)[f] = null; // revert to master
      }
    }
    return newModified;
  });
}

const defaultModifiedTodoDetailsWithNoID = {
  // parent_id: todo.id,
  // utc_start_of_day: toUtcMidnightIso(deadline),
  title_override: null,
  due_time_override: null,
  location_override: null,
  priority_color_overridden: null,
  weekdays_override: null,
  repeitition_override: null,
  completed_at: null, // initially not completed
  all_group_members_todo_started: false, // default value
  categories_override: false,
  deleted_override: false, // default value
  subtodos_overriden: false, // default value
  privacy_overridden: null, // default value
  started_subtodos: false, // default value
}


async function deleteSubtodoOverridesForModifiedTodos(
  modifiedTodos: types.ModifiedTodoDetails[],
  supabase: SupabaseClient<Database>
): Promise<void> {
  modifiedTodos.forEach(x => x.subtodos_overriden = false); // reset the override flag

  // Delete all subtodo overrides for the given parent todo and UTC date
  const { error } = await supabase
    .from('subtodo_overrides')
    .delete()
    .in('overridden_todo', modifiedTodos.map(todo => todo.my_id))

  //Delete completed images for these SubTodos from storage
  //TODO: create a script on the server to delete all completed subtodo images
  data?.forEach(todo => {
    if (todo.completed) {
      deleteSubtodoImageFromMemory(todo);
    }
  })

  if (error) {
    throw new Error(`Failed to delete subtodo overrides for ${modifiedTodos.length} todos: ${error.message}`);
  }
}

async function deleteCategoryOverridesForDate(
  modifiedTodo: types.ModifiedTodoDetails[],
  supabase: SupabaseClient<Database>
): Promise<void> {
  modifiedTodo.forEach(todo => {
    todo.categories_override = false; // reset the override flag
  });

  // Delete category overrides for the given modified todo
  const { error } = await supabase
    .from('todo_overriddes_to_category')
    .delete()
    .in('todo_id', modifiedTodo.map(todo => todo.my_id));

  if (error) {
    throw new Error(`Failed to delete category overrides for todos: ${error.message}`);
  }
}
