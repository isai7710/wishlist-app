export interface TaskItem {
  id: string;
  task: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  createdAt: Date;
}

export interface TasksState {
  taskItems: TaskItem[];
  filter: {
    priority: "Low" | "Medium" | "High" | "All";
    status: "Active" | "Completed";
  };
  errors: {
    task?: string;
    priority?: string;
  };
  selectedTasks: string[]; // array of id's of selected tasks
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<TaskItem, "id" | "createdAt"> }
  | {
      type: "DELETE_TASK";
      payload: string; // id of the task to delete
    }
  | {
      type: "UPDATE_PRIORITY";
      payload: { id: string; priority: TaskItem["priority"] };
    }
  | {
      type: "TOGGLE_COMPLETION";
      payload: string; // id of the task to toggle completion
    }
  | {
      type: "TOGGLE_SELECT";
      payload: string; // id of the task to toggle
    }
  | {
      type: "BULK_DELETE";
    }
  | {
      type: "BULK_UPDATE_PRIORITY";
      payload: TaskItem["priority"];
    }
  | {
      type: "BULK_MARK_AS_COMPLETE";
    }
  | {
      type: "BULK_MARK_AS_INCOMPLETE";
    }
  | { type: "CLEAR_SELECTED" }
  | {
      type: "CLEAR_COMPLETED";
      payload: void; // removes all completed tasks
    }
  | {
      type: "SET_ERROR";
      payload: Partial<TasksState["errors"]>; // for error handling
    }
  | { type: "CLEAR_ERRORS" }
  | { type: "SET_FILTER"; payload: Partial<TasksState["filter"]> };
