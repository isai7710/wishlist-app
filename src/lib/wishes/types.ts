export interface WishItem {
  id: string;
  wish: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  createdAt: Date;
}

export interface WishlistState {
  wishItems: WishItem[];
  filter: {
    priorities: Array<"Low" | "Medium" | "High">;
    status: "Active" | "Completed" | null;
  };
  errors: {
    wish?: string;
    priority?: string;
    prompt?: string;
  };
  selectedWishes: string[];
  ui: {
    darkMode: boolean;
    bulkSelectionMode: boolean;
  };
}

export type WishlistAction =
  // --- INDIVIDUAL WISH ACTIONS ---
  | {
      type: "ADD_WISH";
      payload: Omit<WishItem, "id" | "createdAt" | "completed">;
    }
  | {
      type: "DELETE_WISH";
      payload: string; // id of the wish to delete
    }
  | {
      type: "UPDATE_PRIORITY";
      payload: { id: string; priority: WishItem["priority"] };
    }
  | {
      type: "TOGGLE_COMPLETION";
      payload: string; // id of the wish to toggle completion
    }
  | {
      type: "TOGGLE_SELECT";
      payload: string; // id of the wish to toggle
    }
  // --- BULK WISH ACTIONS ---
  | {
      type: "BULK_DELETE";
    }
  | {
      type: "BULK_UPDATE_PRIORITY";
      payload: WishItem["priority"];
    }
  | {
      type: "BULK_MARK_AS_COMPLETE";
    }
  | {
      type: "BULK_MARK_AS_INCOMPLETE";
    }
  | { type: "CLEAR_SELECTED" }
  | { type: "TOGGLE_SELECT_ALL" }
  | {
      type: "CLEAR_COMPLETED";
      payload: void; // removes all completed wishes
    }
  // --- STATE ERROR ACTIONS ---
  | {
      type: "SET_ERROR";
      payload: Partial<WishlistState["errors"]>; // for error handling
    }
  | { type: "CLEAR_ERRORS" }
  // --- FILTERING ACTIONS
  | { type: "SET_FILTER"; payload: Partial<WishlistState["filter"]> }
  // --- UI STATE ACTIONS ---
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "TOGGLE_BULK_SELECTION_MODE" };
