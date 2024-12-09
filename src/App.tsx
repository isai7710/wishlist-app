import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { taskReducer } from "@/lib/tasks/reducer";
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
      priority: "All",
      status: "Active",
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
    <>
      <main
        className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}
      >
        <div className="container max-w-3xl mx-auto p-4 space-y-4">
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

          <TaskForm errors={state.errors} dispatch={dispatch} />

          <Card>
            <BulkActions
              selectedTasks={state.selectedTasks}
              dispatch={dispatch}
              bulkSelectionMode={bulkSelectionMode}
              setBulkSelectionMode={setBulkSelectionMode}
            />
            <CardContent className="px-4 py-2 space-y-2">
              {state.taskItems.length > 0 ? (
                state.taskItems.map((item) => (
                  <TaskItemComponent
                    key={item.id}
                    task={item}
                    selectedTasks={state.selectedTasks}
                    dispatch={dispatch}
                    bulkSelectionMode={bulkSelectionMode}
                    setBulkSelectionMode={setBulkSelectionMode}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground mb-4">
                  No task items
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </>
  );
}
