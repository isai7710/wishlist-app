import { nanoid } from "nanoid";
import { TasksState, TaskAction } from "./types";

// A reducer is a pure function that determines how the state should change in response to actions
// It must never modify existing state, but rather return a new state object
export function taskReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case "ADD_TASK":
      // return a NEW state
      return {
        // spread previous state to preserve previous properties
        ...state,
        // create new array for taskItems
        taskItems: [
          // spread previous taskItems to keep all existing tasks
          ...state.taskItems,
          // add new task item with the action's accompanying payload data AND generated values for id and createdAt properties
          {
            id: nanoid(),
            task: action.payload.task,
            priority: action.payload.priority,
            completed: action.payload.completed,
            createdAt: new Date(),
          },
        ],
      };

    case "DELETE_TASK":
      return {
        ...state,
        taskItems: state.taskItems.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_PRIORITY":
      return {
        ...state,
        // return new task array using map method
        taskItems: state.taskItems.map((task) =>
          // map over every task item in array to check whether it matches the payload id
          // if it does, create a new task object with existing properties but with updated priority
          // otherwise keep the task unchanged
          task.id === action.payload.id
            ? { ...task, priority: action.payload.priority }
            : task,
        ),
      };

    case "TOGGLE_COMPLETION":
      return {
        ...state,
        taskItems: state.taskItems.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task,
        ),
      };

    case "TOGGLE_SELECT":
      return {
        ...state,
        // does the selectedTasks array already include a task with the payload id?
        selectedTasks: state.selectedTasks.includes(action.payload)
          ? state.selectedTasks.filter((id) => id !== action.payload) // if so, return new array with that ID removed
          : [...state.selectedTasks, action.payload], // if not, add that id to the array
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors, // spread existing errors
          ...action.payload, // merge with new errors
        },
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: {},
      };

    case "BULK_DELETE":
      return {
        ...state,
        taskItems: state.taskItems.filter(
          (task) => !state.selectedTasks.includes(task.id),
        ),
        selectedTasks: [],
      };

    case "BULK_UPDATE_PRIORITY":
      return {
        ...state,
        taskItems: state.taskItems.map((task) =>
          state.selectedTasks.includes(task.id)
            ? { ...task, priority: action.payload }
            : task,
        ),
      };

    case "BULK_MARK_AS_COMPLETE":
      return {
        ...state,
        taskItems: state.taskItems.map((task) =>
          state.selectedTasks.includes(task.id)
            ? { ...task, completed: true }
            : task,
        ),
      };
    case "BULK_MARK_AS_INCOMPLETE":
      return {
        ...state,
        taskItems: state.taskItems.map((task) =>
          state.selectedTasks.includes(task.id)
            ? { ...task, completed: false }
            : task,
        ),
      };

    case "CLEAR_SELECTED":
      return {
        ...state,
        selectedTasks: [],
      };

    case "TOGGLE_SELECT_ALL":
      return {
        ...state,
        selectedTasks:
          state.selectedTasks.length !== state.taskItems.length
            ? state.taskItems.map((task) => task.id)
            : [],
      };

    default:
      return state;
  }
}
