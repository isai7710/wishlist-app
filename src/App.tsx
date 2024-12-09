import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { taskReducer } from "@/lib/tasks/reducer";
import { getFilteredTasks } from "@/lib/tasks/utils";
import { TasksState } from "@/lib/tasks/types";
import { TaskItemComponent } from "@/components/task-item";
import { Toaster } from "@/components/ui/toaster";
import { Sun, Moon } from "lucide-react";
import TaskForm from "@/components/task-form";
import BulkActions from "@/components/bulk-actions";

export default function App() {
  const initialState: TasksState = {
    taskItems: [],
    filter: {
      priorities: [],
      status: null,
    },
    errors: {},
    selectedTasks: [],
  };
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const [darkMode, setDarkMode] = useState(false);
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main
      className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}
    >
      <div className="container max-w-4xl mx-auto p-4 space-y-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Priority Manager</h1>
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </header>

        <TaskForm
          errors={state.errors}
          dispatch={dispatch}
          filter={state.filter}
        />

        <Card>
          <BulkActions
            selectedTasks={state.selectedTasks}
            tasks={state.taskItems}
            dispatch={dispatch}
            bulkSelectionMode={bulkSelectionMode}
            setBulkSelectionMode={setBulkSelectionMode}
          />
          <CardContent className="px-4 py-2 space-y-2">
            {state.taskItems.length === 0 ? (
              <p className="text-center text-muted-foreground mb-4">
                No task items
              </p>
            ) : (
              <>
                {getFilteredTasks(state.taskItems, state.filter).map((item) => (
                  <TaskItemComponent
                    key={item.id}
                    task={item}
                    selectedTasks={state.selectedTasks}
                    dispatch={dispatch}
                    bulkSelectionMode={bulkSelectionMode}
                    setBulkSelectionMode={setBulkSelectionMode}
                  />
                ))}
                {getFilteredTasks(state.taskItems, state.filter).length ===
                  0 && (
                  <p className="text-center text-muted-foreground mb-4">
                    No tasks match the current filters
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  );
}
