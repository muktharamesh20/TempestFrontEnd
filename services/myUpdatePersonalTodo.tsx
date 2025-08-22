/* eslint-disable no-implicit-globals */
import { supabase } from '@/constants/supabaseClient.js';
import { Database } from '@/databasetypes';
import { SupabaseClient } from '@supabase/supabase-js';
import assert from 'assert';
import { parseISO } from 'date-fns';
import { createPersonalTodo } from './myCalendar.js';
import * as types from './utils.js';

/** ---------- Helpers ---------- **/

// True UTC midnight ISO (YYYY-MM-DDT00:00:00.000Z)
function toUtcMidnightIso(dateLike: string): string {
  const d = parseISO(dateLike);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

/**
 * Creates a modified subtodo given the subtodo + the modified master todo.
 * 
 * @param subtodo Subtodo object to convert
 * @returns the modified subtodo details without ID
 */
function convertSubTodoToModifiedNoID(subtodo: types.SubtodoDetails, modifiedMasterId: string): types.ModifiedSubTodoDetailsNoID {
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
 * Creates a modified subtodo given the subtodo + the modified master todo.
 * 
 * @param subtodo Subtodo object to convert
 * @returns the modified subtodo details without ID
 */
function convertSubTodoToModified(subtodo: types.SubtodoDetails, modifiedMasterId: string): types.ModifiedSubTodoDetails {
  const result: types.ModifiedSubTodoDetails = {
    overridden_todo: modifiedMasterId,
    location: subtodo.location,
    priority: subtodo.priority,
    title: subtodo.title,
    deadline: subtodo.deadline,
    my_id: types.generateUUID(),
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

  // otherModifications: { subtodosOverridden: boolean, categoriesOverridden: boolean, },
  subtodosOverriden: boolean,
  stateChanges: { completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean },
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
    subtodos_overriden: subtodosOverriden,
    categories_override: false //otherModifications.categoriesOverridden,
  };
}

function changeSingularModifiedTodoDetails(
  masterTodo: types.TodoDetails,
  modifiedTodo: types.ModifiedTodoDetails,
  newTodo: types.TodoDetails,
  // instance_deadline: string, this is misleading now cuz it could have been different before changing the deadline

  // otherModifications: { subtodosOverridden: boolean, categoriesOverridden: boolean, },
  subtodosOverridden: boolean,
  stateChanges: { completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean },
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
    //weekdays_override: newTodo.weekdays.sort().join('') !== masterTodo.weekdays.sort().join('') ? newTodo.weekdays : null,
    privacy_overridden: newTodo.privacy !== masterTodo.privacy ? newTodo.privacy : null,
    //repeitition_override: newTodo.repeat_every !== masterTodo.repeat_every ? newTodo.repeat_every : null,

    // state changes
    completed_at: stateChanges.completed ? new Date(Date.now()).toISOString() : modifiedTodo.completed_at,
    all_group_members_todo_started: stateChanges.allGroupMembersTodoStarted ? true : modifiedTodo.all_group_members_todo_started, // cannot revert all_group_members_todo_started to false
    started_subtodos: stateChanges.startedSubtodos ? true : modifiedTodo.started_subtodos, // cannot revert started_subtodos to false
    deleted_override: stateChanges.deletedTodo ? true : modifiedTodo.deleted_override, // cannot revert deleted_override to false

    // subtodo/category mdofications
    subtodos_overriden: subtodosOverridden,
    categories_override: false //otherModifications.categoriesOverridden,
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
async function removeAnOverriddenFieldForAllModifiedTodods(
  modifiedTodos: types.ModifiedTodoDetails[],
  field: (keyof types.ModifiedTodoDetails)[]
): Promise<types.ModifiedTodoDetails[]> {
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
    if ('categories_override' in field) {
      field = field.filter(f => f !== 'categories_override');
      deleteCategoryOverridesForDate(modifiedTodos, supabase); // delete all category overrides for these modified todos
    }
  }

  const newTodos =  modifiedTodos.map(modified => {
    const newModified: types.ModifiedTodoDetails = { ...modified };
    for (const f of field) {
      if (newModified[f] !== null) {
        (newModified as any)[f] = null; // revert to master
      }
    }
    return newModified;
  });

  const { data, error } = await supabase
  .from('todo_overrides')
  .upsert(newTodos)

if (error) {
  throw new Error(`Failed to revert modified todos: ${error.message}`)
}

return (data ?? []) as types.ModifiedTodoDetails[]

  //return newTodos
}

/**
 * Changes the subtodos for subtodos that aren't modified yet.
 * 
 * Assumes that there already exists a modified todo for the given master todo and date.
 */
async function changeOldSubtodos(
  oldSubtodos: types.SubtodoDetails[], //can have internal modifications
  modifiedTodo: types.ModifiedTodoDetails,
  newSubtodos: types.ModifiedSubTodoDetailsNoID[], //subtodos to add
  deletedSubtodos: string[], // list of subtodo IDs to delete
): Promise<types.ModifiedSubTodoDetails[]> {
  if (modifiedTodo.subtodos_overriden) {
    throw new Error('this method should only be used when the modified todo does not have subtodos overridden');
  }
  assert(newSubtodos.every(value => value.overridden_todo === modifiedTodo.my_id), 'all new subtodos should belong to the modified todo');
  assert(oldSubtodos.every(value => value.subtodo_of === modifiedTodo.parent_id), 'old subtodos should belong to the master todo');

  //if for some reason there already exist modified subtodos for this modified todo, remove them
  removeAnOverriddenFieldForAllModifiedTodods([modifiedTodo], ['subtodos_overriden']);
  modifiedTodo.subtodos_overriden = true; // set the override flag, since above function sets it back to false

  // Remove deleted subtodos
  const remainingOldSubtodos = oldSubtodos.filter(sub => !deletedSubtodos.includes(sub.id));
  const { error: deletionError } = await supabase
    .from('subtodo_overrides')
    .delete()
    .in('my_id', deletedSubtodos);

  if (deletionError) {
    throw new Error(`Failed to delete ${deletedSubtodos.length} subtodos: ${deletionError.message}`);
  }

  // Convert remaining old subtodos to modified subtodos + get ready to convert completed subtodos to complted modified subtodos
  const convertedSubtodos: { oldSubtodo: types.SubtodoDetails, modifiedSubtodo: types.ModifiedSubTodoDetails }[] = remainingOldSubtodos.map(x => ({
    oldSubtodo: x,
    modifiedSubtodo: convertSubTodoToModified(x, modifiedTodo.my_id),
  }));

  // Change completed subtodos to have the modified todos id
  await changeCompletedSubtodosToModified(convertedSubtodos, modifiedTodo.my_id);

  // Create new modified subtodos from the new subtodos
  const newSubtodosWithId: types.ModifiedSubTodoDetails[] = newSubtodos.map(sub => ({ ...sub, my_id: types.generateUUID() })); // set the overridden_todo to the modified todo's ID
  const allSubtodosToAdd = [...convertedSubtodos.map(x => x.modifiedSubtodo), ...newSubtodosWithId];

  // Insert all new modified subtodos
  const { error } = await supabase
    .from('subtodo_overrides')
    .upsert(allSubtodosToAdd);

  if (error) {
    throw new Error(`Failed to insert ${allSubtodosToAdd.length} modified subtodos: ${error.message}`);
  }

  return allSubtodosToAdd;
}

/**
 * Adds and deletes subtodos for a modified todo that already has subtodos overridden.
 * 
 * Assumes that there already exists a modified todo for the given master todo and date.
 */
async function changeOldModifiedSubtodos(
  oldSubtodos: types.ModifiedSubTodoDetails[], //can have internal modifications from before
  modifiedTodo: types.ModifiedTodoDetails,
  newSubtodos: types.ModifiedSubTodoDetailsNoID[], //subtodos to add
  deletedSubtodos: string[], // list of subtodo IDs to delete
) {
  assert(oldSubtodos.every(value => value.overridden_todo === modifiedTodo.my_id), 'all old subtodos should belong to the modified todo');
  assert(newSubtodos.every(value => value.overridden_todo === modifiedTodo.my_id), 'all new subtodos should belong to the modified todo');
  if (!modifiedTodo.subtodos_overriden) {
    throw new Error('this method should only be used when the modified todo has subtodos overridden');
  }
  // delete deleted subtodos
  const { error } = await supabase
    .from('subtodo_overrides')
    .delete()
    .in('my_id', deletedSubtodos);

  if (error) {
    throw new Error(`Failed to delete ${deletedSubtodos.length} subtodos: ${error.message}`);
  }

  // Remove keep remaining subtodos
  const remainingOldSubtodos = oldSubtodos.filter(sub => !deletedSubtodos.includes(sub.my_id));
  const updatedNewSubtodos = newSubtodos.map(sub => ({ ...sub, my_id: types.generateUUID() })); // assign new IDs to new subtodos

  const finalTodos = [...remainingOldSubtodos, ...updatedNewSubtodos];

  // Insert all new modified subtodos
  const { error: error2 } = await supabase
    .from('subtodo_overrides')
    .upsert(finalTodos);

  if (error2) {
    throw new Error(`Failed to insert ${finalTodos.length} modified subtodos: ${error2.message}`);
  }

  // Combine remaining old subtodos and new subtodos
  return finalTodos
}

async function changeCompletedSubtodosToModified(
  modifications: { oldSubtodo: types.SubtodoDetails; modifiedSubtodo: types.ModifiedSubTodoDetails }[],
  overriddenTodoID: string
) {
  await Promise.all(
    modifications.map(({ oldSubtodo, modifiedSubtodo }) =>
      supabase
        .from('subtodos_completed')
        .update({ parent_subtodo: modifiedSubtodo.my_id })
        .eq('parent_modified_todo', overriddenTodoID)
        .eq('parent_subtodo', oldSubtodo.id)
    )
  );
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

  throw new Error('deleteSubtodoOverridesForModifiedTodos is not implemented yet');

  // Delete all subtodo overrides for the given parent todo and UTC date
  // const { error } = await supabase
  //   .from('subtodo_overrides')
  //   .delete()
  //   .in('overridden_todo', modifiedTodos.map(todo => todo.my_id))

  //Delete completed images for these SubTodos from storage
  //TODO: create a script on the server to delete all completed subtodo images ***************


  // data?.forEach(todo => {
  //   if (todo.completed) {
  //     deleteSubtodoImageFromMemory(todo);
  //   }
  // })
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


async function createInitialSubTodos(
  subtodos: types.SubtodoDetailsNoId[],
  masterTodo: types.TodoDetails,
): Promise<types.SubtodoDetails[]> {
  // Add an id
  assert(subtodos.every(subtodo => subtodo.subtodo_of === masterTodo.id), 'all subtodos should belong to the master todo');
  const finalSubtodos: types.SubtodoDetails[] = subtodos.map(subtodo => ({ ...subtodo, my_id: types.generateUUID(), subtodo_of: masterTodo.id }));

  // Insert the new subtodos into the database
  const { data, error } = await supabase
    .from('subtodo')
    .insert(finalSubtodos)
    .select();

  if (error) {
    throw new Error(`Failed to insert ${finalSubtodos.length} new subtodos: ${error.message}`);
  }

  return data;
}

async function changeMasterSubtodos(
  oldSubtodos: types.SubtodoDetails[],
  modifiedSubtodos: types.ModifiedSubTodoDetails[],){

  }




//////////////////////////////////////////////////////Real Methods??///////////////////////////////////////////////

async function createPersonalMasterTodo(my_user_id: string, title: string, deadline: string, location: string, priority: number, weekdays: number[], repeat_every: types.RepeatPeriod, privacy: number, end_repeat: string, habit: boolean, backlog: boolean, subtodos: types.SubtodoDetailsNoId[]): Promise<[types.TodoDetails, types.SubtodoDetails[]]> {
  const personalTodo = await createPersonalTodo({ person_id: my_user_id, title: title, deadline: deadline, location: location, priority: priority, weekdays: weekdays, repeat_every: repeat_every, privacy: privacy, end_repeat: end_repeat, habit: habit, backlog: backlog }, supabase)
  const newSubtodos = createInitialSubTodos(subtodos, personalTodo);

  return [personalTodo, await newSubtodos];

}

async function modifySingleDayPersonal(
  my_user_id: string,
  todo: types.TodoDetails,
  oldModifiedTodo: types.ModifiedTodoDetails | null,
  newTodo: types.TodoDetails,
  instance_deadline: string,

  // otherModifications: { subtodosOverridden: boolean, categoriesOverridden: boolean, },
  subtodosOverriden: boolean,
  stateChanges: { completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean },

  masterSubtodos: types.SubtodoDetails[],
  oldModifiedSubtodos: types.ModifiedSubTodoDetails[],
  newSubtodos: types.ModifiedSubTodoDetailsNoID[],
  deletedSubtodos: string[],
) {
  assert(todo.person_id === my_user_id, 'todo must belong to the user');

  // Create the modified todo if it doesn't exist
  if (!oldModifiedTodo) {
    const modifiedTodoDetailsNoID = createInitialModifiedTodoDetailsNoID(
      todo,
      newTodo,
      instance_deadline,
      subtodosOverriden,
      stateChanges
    );

    // Insert the modified todo
    const { data: modifiedTodo, error } = await supabase
      .from('todo_overrides')
      .insert({
        ...modifiedTodoDetailsNoID,
        my_id: types.generateUUID(),
        parent_id: todo.id,
        utc_start_of_day: toUtcMidnightIso(instance_deadline),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create modified todo: ${error.message}`);
    }

    // Create subtodos if they exist
    if (masterSubtodos && masterSubtodos.length > 0 && (newSubtodos.length > 0 || deletedSubtodos.length > 0)) { //only modify if needed
      return changeOldSubtodos(masterSubtodos, modifiedTodo, newSubtodos, deletedSubtodos);
    } else if (oldModifiedSubtodos && oldModifiedSubtodos.length > 0) {
      assert.fail('bro why are there old modified subtodos')
    } else {
      return [];
    }
  } else {
    // If the modified todo already exists, update it
    const modifiedTodo = changeSingularModifiedTodoDetails(
      todo,
      oldModifiedTodo,
      newTodo,
      subtodosOverriden,
      stateChanges
    );

    // Update the modified todo
    const { data: updatedModifiedTodo, error } = await supabase
      .from('todo_overrides')
      .update(modifiedTodo)
      .eq('my_id', oldModifiedTodo.my_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update modified todo: ${error.message}`);
    }


    if (!oldModifiedTodo.subtodos_overriden && (newSubtodos.length > 0 || deletedSubtodos.length > 0)) { //if we haven't already overriden the subtodos, we need to copy them over
      return changeOldSubtodos(masterSubtodos, updatedModifiedTodo, newSubtodos, deletedSubtodos);
    } else if (newSubtodos.length > 0 || deletedSubtodos.length > 0) { // if we have already overriden them, then we need to change them
      return changeOldModifiedSubtodos(oldModifiedSubtodos, updatedModifiedTodo, newSubtodos, deletedSubtodos);
    }
  }
}


async function modifyAllDaysTodoLevel(
  my_user_id: string,
  todo: types.TodoDetails,
  currOldModifiedTodos: types.ModifiedTodoDetails | null, //if the user is modifying an already modified todo
  oldModifiedTodos: types.ModifiedTodoDetails[],
  newTodo: types.TodoDetails,

  // otherModifications: { categoriesOverridden: boolean, },
  // stateChanges: { completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean },

  // masterSubtodos: types.SubtodoDetails[],
  // oldModifiedSubtodos: types.ModifiedSubTodoDetails[],
  newSubtodos: types.ModifiedSubTodoDetailsNoID[],
  deletedSubtodos: string[],
): Promise<types.TodoDetails> {
  if (currOldModifiedTodos) {  //if the user is modifying an already modified todo, it will become a normal todo... actually nah, we'll just upsert it and change stuff
    assert(currOldModifiedTodos.parent_id === todo.id, 'current modified todos must belong to the master todo');

    // await supabase
    // .from("todo_overrides")
    // .delete()
    // .eq("my_id", currOldModifiedTodos.my_id)
    // .neq("deleted_override", true) // not deleted
    // .is("completed_at", null)      // not completed
    // .or("all_group_members_todo_started.is.null,all_group_members_todo_started.eq.false");


    //we are updating the relevant fields in the modified todo
    const updatedModifiedTodo = changeSingularModifiedTodoDetails(
      todo,
      currOldModifiedTodos,
      newTodo,
      currOldModifiedTodos.subtodos_overriden,
      { completed: currOldModifiedTodos.completed_at !== null, allGroupMembersTodoStarted: currOldModifiedTodos.all_group_members_todo_started || false, startedSubtodos: currOldModifiedTodos.started_subtodos, deletedTodo: currOldModifiedTodos.deleted_override }
    );
  
    const { data, error } = await supabase.from('todo_overrides').upsert(updatedModifiedTodo).eq('my_id', currOldModifiedTodos.my_id);
  }

  assert(todo.person_id === my_user_id, 'todo must belong to the user');

  // we're modifying all days for the specific aspects that the user picks (ie if they only change the priority, the modified
  // todos can stay, but all the priorities will be changed)
  assert(newTodo.id === todo.id, 'updated todo should have the same ID as the original todo');

  // remove overriden field for all differing things in newTodo from todo
  const overriddenFields = (Object.keys(newTodo) as (keyof types.ModifiedTodoDetails)[]).filter(
    key => key in todo && newTodo[key as keyof types.TodoDetails] !== todo[key as keyof types.TodoDetails]
  );
  const newTodos = removeAnOverriddenFieldForAllModifiedTodods(oldModifiedTodos, overriddenFields);

  //replace the old todo with the new todo
  const {data, error} = await supabase.from('todo').upsert(newTodo).eq('id', todo.id);

  if (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
  const updatedTodo = data![0] as types.TodoDetails;
  assert(updatedTodo.id === todo.id, 'updated todo should have the same ID as the original todo');



  //modifying the subtdos woohoo

  //step 1: remove all subtodos overrides for all modified todos (if there doesn't exist ANY that are completed already from that day)
  //step 1 alternate:  literally touch no overrides at all for any modified todos (except the current one?)
  //step 2: change the master subtodos

  if (newSubtodos) {
    assert(newSubtodos.every(subtodo => subtodo.overridden_todo === updatedTodo.id), 'all new subtodos should belong to the updated todo');
  }
  const {data: data2, error: error2} = await supabase.from('subtodo').upsert(newSubtodos)
  if (error2) {
    throw new Error(`Failed to update subtodos: ${error2.message}`);
  }

  const{ data: data3, error: error3 } = await supabase.from('subtodo').delete().in('id', deletedSubtodos);
  if (error3) {
    throw new Error(`Failed to delete subtodos: ${error3.message}`);
  }

  ///////////////////////////////



  return data![0] as types.TodoDetails; // return the updated todo
}

/**
 * we're modifying all days for the specific aspects that the user picks (ie if they only change the priority, the modified
 * todos can stay, but all the priorities will be changed)
 * 
 * cannot make update if its a modified subtodo!!!  Must individually change that then
 */
async function modifyAllDaysSubTodoLevel(
  my_user_id: string,
  todo: types.TodoDetails,
  // oldModifiedTodo: types.ModifiedTodoDetails | null,
  // newTodo: types.TodoDetails,
  // instance_deadline: string,


  // otherModifications: { subtodosOverridden: boolean, categoriesOverridden: boolean, },
  // stateChanges: { completed: boolean, allGroupMembersTodoStarted: boolean, startedSubtodos: boolean, deletedTodo: boolean },

  masterSubtodos: types.SubtodoDetails[],
  // oldModifiedSubtodos: types.ModifiedSubTodoDetails[],
  newModification: types.SubtodoDetails,
  // newSubtodos: types.ModifiedSubTodoDetailsNoID[],
  // deletedSubtodos: string[],
): Promise<types.SubtodoDetails[]> {
  assert(todo.person_id === my_user_id, 'todo must belong to the user');

  // we're modifying all days for the specific aspects that the user picks (ie if they only change the priority, the modified
  // todos can stay, but all the priorities will be changed)

  assert(masterSubtodos.every(subtodo => subtodo.subtodo_of === todo.id), 'all subtodos should belong to the master todo');
  assert(newModification.subtodo_of === todo.id, 'new subtodo should belong to the master todo');

  assert(newModification.id in masterSubtodos.map(subtodo => subtodo.id), 'new subtodo should be one of the master subtodos');

  // Update the subtodo in the database
  const { data, error } = await supabase
    .from('subtodo')
    .upsert(newModification)

  if (error) {
    throw new Error(`Failed to update subtodo: ${error.message}`);
  }

  masterSubtodos.map(subtodo => {subtodo.id === newModification.id ? newModification : subtodo});

  return masterSubtodos

}

//TODO: make sure the state changes are accounted for?

async function modifyAllFutreEvents(){

}


/**
 * Idea:
 * 
 * Generally, we have a bunch of normal todos
 *    -If we want to override a single date, we create a modified todo for that date
 *    -If we want to override all future dates, we create a new todo
 * *  -If we want to complete a todo, we create a modified todo
 * 
 * If we have a bunch of normal subtodos:
 *    -If we want to override a single date, we create all modified subtodos for that date
 *    -If we want to override all future dates, we create a new todo with the subtodos
 *    -If we want to complete a subtodo, we add it to the completed subtodos table
 * 
 * 
 * No matter what, we don't touch completed todos/subtodos (UNLESS we're deleting all of the event/todo)
 * Maybe, we use the completed at to determine if friends can see the image or not??
 */


/**
 * what can be overridden for a singular todo rn:
 * 
 * In a todo: title, deadline, location, priority, subtodos, completed
 * In a subtodo: title, deadline, location, priority, completed
 * 
 * Why not privacy? Cuz then it gets even harder to track who can see what for the user
 *    - Same for categories
 */