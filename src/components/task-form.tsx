import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskSeeder from "@/components/task-seeder";
import TaskFilter from "@/components/task-filter";
import { Plus } from "lucide-react";
import { TaskItem, TasksState, TaskAction } from "@/lib/tasks/types";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  errors: TasksState["errors"];
  dispatch: React.Dispatch<TaskAction>;
  filter: Partial<TasksState["filter"]>;
}

export default function TaskForm({ errors, dispatch, filter }: TaskFormProps) {
  const [taskInput, setTaskInput] = useState<string>("");
  const [priorityInput, setPriorityInput] = useState<TaskItem["priority"] | "">(
    "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<TasksState["errors"]> = {};
    if (!taskInput.trim()) {
      errors.task = "Required";
    }
    if (!priorityInput) {
      errors.priority = "Priority must be selected";
    }
    if (Object.keys(errors).length > 0) {
      dispatch({
        type: "SET_ERROR",
        payload: errors,
      });
      return;
    }

    const priority = priorityInput as TaskItem["priority"];

    dispatch({
      type: "ADD_TASK",
      payload: {
        task: taskInput,
        priority,
        completed: false,
      },
    });

    setTaskInput("");
    setPriorityInput("");
    dispatch({ type: "CLEAR_ERRORS" });
  };

  return (
    <div className="flex gap-2 w-full">
      <form
        id="add-task-form"
        onSubmit={handleSubmit}
        className="flex gap-2 w-full"
      >
        <div className="flex-grow">
          <Input
            type="text"
            value={taskInput}
            onChange={(e) => {
              setTaskInput(e.target.value);
              if (errors.task) {
                dispatch({
                  type: "SET_ERROR",
                  payload: { task: undefined },
                });
              }
            }}
            placeholder="Enter a new task"
            className={cn(
              "flex-grow",
              errors.task && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.task && (
            <p className="text-xs sm:text-sm text-red-500">{errors.task}</p>
          )}
        </div>
        <div>
          <Select
            value={priorityInput}
            onValueChange={(value) => {
              setPriorityInput(value as TaskItem["priority"]);
              if (errors.priority) {
                dispatch({
                  type: "SET_ERROR",
                  payload: { priority: undefined },
                });
              }
            }}
          >
            <SelectTrigger
              className={cn(
                "w-[130px] sm:w-full",
                errors.priority && "border-red-500 focus-visible:ring-red-500",
              )}
            >
              <SelectValue placeholder="Select priority " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-xs sm:text-sm text-red-500">{errors.priority}</p>
          )}
        </div>
      </form>
      <Button
        type="submit"
        form="add-task-form"
        size="icon"
        className="shrink-0"
      >
        <Plus />
      </Button>
      <TaskSeeder errors={errors} dispatch={dispatch} />
      <TaskFilter filter={filter} dispatch={dispatch} />
    </div>
  );
}
