import { Badge } from "@/components/ui/badge";
import { TaskAction, TaskItem, TasksState } from "@/lib/tasks/types";
import { MoreHorizontal, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: TaskItem;
  selectedTasks: TasksState["selectedTasks"];
  dispatch: React.Dispatch<TaskAction>;
  bulkSelectionMode: boolean;
  setBulkSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskItemComponent({
  task,
  selectedTasks,
  dispatch,
  bulkSelectionMode,
  setBulkSelectionMode,
}: TaskItemProps) {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md bg-card hover:text-accent-foreground transition-colors">
      <AnimatePresence>
        {bulkSelectionMode && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            className="flex"
          >
            <Checkbox
              checked={selectedTasks.includes(task.id)}
              onClick={() =>
                dispatch({
                  type: "TOGGLE_SELECT",
                  payload: task.id,
                })
              }
              className="border-2 border-primary"
              aria-label="Select task"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onClick={() => {
          if (!bulkSelectionMode) {
            setBulkSelectionMode(!bulkSelectionMode);
          }
          dispatch({ type: "TOGGLE_SELECT", payload: task.id });
        }}
        className={cn(
          "flex-grow cursor-pointer",
          task.completed ? "text-muted-foreground" : "",
        )}
      >
        <div className="flex items-center space-x-2">
          <p
            className={`text-md font-medium ${task.completed ? "line-through" : ""}`}
          >
            {task.task}
          </p>
          {task.completed && (
            <p className="flex items-center gap-1 text-xs text-green-500">
              Completed <Check className="w-3 h-3" />
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {task.createdAt.toDateString()}
        </p>
      </div>
      <Badge variant="secondary" className="text-xs shadow-none">
        {task.priority}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="w-5 h-5 hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              dispatch({
                type: "TOGGLE_COMPLETION",
                payload: task.id,
              });
            }}
          >
            Mark as {`${task.completed ? "incomplete" : "completed"}`}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set Priority</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: task.id, priority: "Low" },
                    })
                  }
                >
                  <span>Low</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: task.id, priority: "Medium" },
                    })
                  }
                >
                  <span>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: task.id, priority: "High" },
                    })
                  }
                >
                  <span>High</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => {
              dispatch({
                type: "DELETE_TASK",
                payload: task.id,
              });
              toast({
                title: "Successfully deleted task",
              });
            }}
          >
            <span className="text-red-500">Delete Task</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
