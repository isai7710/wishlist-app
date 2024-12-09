"use client";

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
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TaskItem, TasksState, TaskAction } from "@/lib/tasks/types";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Blocks, Plus, Filter } from "lucide-react";
import { generateRandomTasks } from "@/lib/tasks/utils";

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
  const [seedCount, setSeedCount] = useState<number>(5);

  const handleStatusChange = (status: TasksState["filter"]["status"]) => {
    dispatch({
      type: "SET_FILTER",
      payload: { status },
    });
  };

  const handlePriorityChange = (priority: TaskItem["priority"]) => {
    dispatch({
      type: "SET_FILTER",
      payload: {
        priorities: filter.priorities?.includes(priority)
          ? filter.priorities.filter((p) => p !== priority) // Remove if exists
          : [...(filter.priorities || []), priority], // Add if doesn't exist
      },
    });
  };

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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
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
            errors.task && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {errors.task && <p className="text-sm text-red-500">{errors.task}</p>}
      </div>
      <div className="w-full sm:w-auto">
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
              "w-full sm:w-[180px]",
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
      <div className="flex gap-2">
        <Button type="submit" size="icon" className="shrink-0">
          <Plus />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Blocks />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex flex-col gap-2 p-4">
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
                type="button"
                onClick={() => {
                  const randomTasks = generateRandomTasks(seedCount);
                  randomTasks.forEach((task) => {
                    dispatch({ type: "ADD_TASK", payload: task });
                  });
                }}
              >
                Add {seedCount} random tasks
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 relative"
            >
              <Filter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter Tasks by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal">
              Status
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filter.status === "Completed"}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={() => {
                if (filter.status === "Completed") {
                  return;
                }
                handleStatusChange("Completed");
              }}
            >
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.status === "Active"}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={() => {
                if (filter.status === "Active") {
                  return;
                }
                handleStatusChange("Active");
              }}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal">
              Priority
            </DropdownMenuLabel>
            {(["Low", "Medium", "High"] as const).map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={filter.priorities?.includes(priority)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => handlePriorityChange(priority)}
              >
                {priority}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-1 hover:bg-red-500/10 text-red-500"
              onSelect={(e) => e.preventDefault()}
              onClick={() => {
                dispatch({
                  type: "SET_FILTER",
                  payload: { priorities: [], status: null },
                });
              }}
            >
              Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </form>
  );
}
