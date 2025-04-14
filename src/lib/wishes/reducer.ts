import { nanoid } from "nanoid";
import { WishlistState, WishlistAction } from "@/lib/wishes/types";

// A reducer is a pure function that determines how the state should change in response to actions
// It must never modify existing state, but rather return a new state object
export function wishlistReducer(
  state: WishlistState,
  action: WishlistAction,
): WishlistState {
  switch (action.type) {
    case "ADD_WISH":
      // each action type must return a NEW state
      return {
        // spread current state to preserve current properties
        ...state,
        // create new array for wishItems
        wishItems: [
          // spread current wishItems to keep all existing tasks
          ...state.wishItems,
          // add new wish item with the action's accompanying payload data AND generated values for id and createdAt properties
          {
            id: nanoid(),
            wish: action.payload.wish,
            priority: action.payload.priority,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };

    case "DELETE_WISH":
      return {
        ...state,
        //  return new wish items array with the wish id to delete filtered out (deleted)
        wishItems: state.wishItems.filter((wish) => wish.id !== action.payload),
      };

    case "UPDATE_PRIORITY":
      return {
        ...state,
        // return NEW wish items array with the updated priority using the map method
        wishItems: state.wishItems.map((wish) =>
          // map over every wish item in the array to check whether it matches the payload id
          // if it does, create a new wish object with existing properties but with updated priority
          // otherwise keep the wish unchanged
          wish.id === action.payload.id
            ? { ...wish, priority: action.payload.priority }
            : wish,
        ),
      };

    case "TOGGLE_COMPLETION":
      return {
        ...state,
        wishItems: state.wishItems.map((wish) =>
          wish.id === action.payload
            ? { ...wish, completed: !wish.completed }
            : wish,
        ),
      };

    case "TOGGLE_SELECT":
      return {
        ...state,
        // does the selectedWishes array already include a wish with the payload id?
        selectedWishes: state.selectedWishes.includes(action.payload)
          ? state.selectedWishes.filter((id) => id !== action.payload) // if so, return new array with that ID removed
          : [...state.selectedWishes, action.payload], // if not, add that id to the array
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
        wishItems: state.wishItems.filter(
          (wish) => !state.selectedWishes.includes(wish.id),
        ),
        selectedWishes: [],
      };

    case "BULK_UPDATE_PRIORITY":
      return {
        ...state,
        wishItems: state.wishItems.map((wish) =>
          state.selectedWishes.includes(wish.id)
            ? { ...wish, priority: action.payload }
            : wish,
        ),
      };

    case "BULK_MARK_AS_COMPLETE":
      return {
        ...state,
        wishItems: state.wishItems.map((wish) =>
          state.selectedWishes.includes(wish.id)
            ? { ...wish, completed: true }
            : wish,
        ),
      };
    case "BULK_MARK_AS_INCOMPLETE":
      return {
        ...state,
        wishItems: state.wishItems.map((wish) =>
          state.selectedWishes.includes(wish.id)
            ? { ...wish, completed: false }
            : wish,
        ),
      };

    case "CLEAR_SELECTED":
      return {
        ...state,
        selectedWishes: [],
      };

    case "TOGGLE_SELECT_ALL":
      return {
        ...state,
        selectedWishes:
          state.selectedWishes.length !== state.wishItems.length
            ? state.wishItems.map((wish) => wish.id)
            : [],
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };

    case "TOGGLE_DARK_MODE":
      return {
        ...state,
        ui: { ...state.ui, darkMode: !state.ui.darkMode },
      };

    case "TOGGLE_BULK_SELECTION_MODE":
      return {
        ...state,
        ui: { ...state.ui, bulkSelectionMode: !state.ui.bulkSelectionMode },
      };

    default:
      return state;
  }
}
