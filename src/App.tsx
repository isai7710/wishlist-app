import { useReducer, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { taskReducer } from "@/lib/tasks/reducer";
import { getFilteredTasks } from "@/lib/tasks/utils";
import { TasksState } from "@/lib/tasks/types";
import { Toaster } from "@/components/ui/toaster";
import TaskForm from "@/components/tasks/task-form";
import BulkActions from "@/components/tasks/bulk-actions";
import { TaskItemComponent } from "@/components/tasks/task-item";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
    <div
      className={`min-h-screen flex flex-col transition-colors ${darkMode ? "dark" : ""}`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
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
                  {getFilteredTasks(state.taskItems, state.filter).map(
                    (item) => (
                      <TaskItemComponent
                        key={item.id}
                        task={item}
                        selectedTasks={state.selectedTasks}
                        dispatch={dispatch}
                        bulkSelectionMode={bulkSelectionMode}
                        setBulkSelectionMode={setBulkSelectionMode}
                      />
                    ),
                  )}
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
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
