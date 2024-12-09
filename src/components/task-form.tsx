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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskItem, TasksState, TaskAction } from "@/lib/tasks/types";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Blocks, Plus } from "lucide-react";
import { generateRandomTasks } from "@/lib/tasks/utils";

interface TaskFormProps {
  errors: TasksState["errors"];
  dispatch: React.Dispatch<TaskAction>;
}

export default function TaskForm({ errors, dispatch }: TaskFormProps) {
  const [taskInput, setTaskInput] = useState<string>("");
  const [priorityInput, setPriorityInput] = useState<TaskItem["priority"] | "">(
    "",
  );
  const [seedCount, setSeedCount] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<TasksState["errors"]> = {};
    if (!taskInput.trim()) {
      errors.task = "Task name is required";
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
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="flex flex-col flex-grow">
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
            errors.task && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {errors.task && <p className="text-sm text-red-500">{errors.task}</p>}
      </div>
      <div className="flex flex-col">
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
              "w-[180px] relative",
              errors.priority && "border-red-500 focus-visible:ring-red-500",
            )}
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-red-500">{errors.priority}</p>
        )}
      </div>
      <Button type="submit" size="icon">
        <Plus />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon">
            <Blocks />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-2 p-4 w-56">
          <div className="flex w-full space-x-2">
            <Slider
              id="seedSlider"
              min={1}
              max={20}
              step={1}
              value={[seedCount]}
              onValueChange={(value) => setSeedCount(value[0])}
            />
            <Badge variant="secondary">{seedCount}</Badge>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              const randomTasks = generateRandomTasks(seedCount);
              randomTasks.forEach((task) => {
                dispatch({ type: "ADD_TASK", payload: task });
              });
            }}
          >
            Add {seedCount} random tasks
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}
