import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import * as types from './utils.js';

export async function handleTodoOverrides(
  supabaseClient: SupabaseClient<Database>,
  todoId: string,
  editMode: 'old' | 'new' | 'today' | 'future',
  destroyCompleted: boolean,
  newSubtodos: types.Subtodo[]
) {
  let subtodosOverridden = false;

  if (editMode === 'new') {
    // Get completed subtodos for the new todo
    const { data: completedSubs, error: completedErr } = await supabaseClient
      .from('subtodos')
      .select('id')
      .eq('todo_id', todoId)
      .eq('completed', true);

    if (completedErr) throw completedErr;

    const hasCompleted = completedSubs && completedSubs.length > 0;

    if (!hasCompleted || destroyCompleted) {
      // Delete all overridden subtodos
      await supabaseClient
        .from('subtodos')
        .delete()
        .eq('todo_id', todoId);

      // Insert new subtodos
      if (newSubtodos.length > 0) {
        await supabaseClient
          .from('subtodos')
          .insert(
            newSubtodos.map(s => ({
              ...s,
              todo_id: todoId
            }))
          );
      }

      subtodosOverridden = false;
    } else {
      // Keep overridden subtodos
      subtodosOverridden = true;
    }
  }

  if (editMode === 'today') {
    // Today works like "future" but no recurrence split
    subtodosOverridden = true; // always true
  }

  if (editMode === 'future' && editMode !== 'today') {
    // Get completed subtodos for this todo
    const { data: completedSubs, error: completedErr } = await supabaseClient
      .from('subtodos')
      .select('id')
      .eq('todo_id', todoId)
      .eq('completed', true);

    if (completedErr) throw completedErr;

    const hasCompleted = completedSubs && completedSubs.length > 0;

    if (!hasCompleted || destroyCompleted) {
      // Delete overridden subtodos
      await supabaseClient
        .from('subtodos')
        .delete()
        .eq('todo_id', todoId);

      // Insert new subtodos
      if (newSubtodos.length > 0) {
        await supabaseClient
          .from('subtodos')
          .insert(
            newSubtodos.map(s => ({
              ...s,
              todo_id: todoId
            }))
          );
      }

      subtodosOverridden = false;
    } else {
      // Keep overridden subtodos
      subtodosOverridden = true;
    }
  }

  // Update the main todo record
  const { error: updateErr } = await supabaseClient
    .from('todos')
    .update({ subtodos_overriden: subtodosOverridden })
    .eq('id', todoId);

  if (updateErr) throw updateErr;
}
 