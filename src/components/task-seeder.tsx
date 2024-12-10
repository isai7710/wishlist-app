import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Blocks, Loader } from "lucide-react";
import { TaskAction, TasksState } from "@/lib/tasks/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateRandomTasks } from "@/lib/tasks/utils";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface TaskSeederProps {
  errors: Partial<TasksState["errors"]>;
  dispatch: React.Dispatch<TaskAction>;
}

export default function TaskSeeder({ errors, dispatch }: TaskSeederProps) {
  const [seedCount, setSeedCount] = useState<number>(5);
  const [taskSubject, setTaskSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSeedSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!taskSubject.trim()) {
      setErrorMessage("Prompt is required");
      dispatch({
        type: "SET_ERROR",
        payload: { prompt: "Prompt is required" },
      });
      return;
    }

    setIsLoading(true);
    try {
      const seededTasks = await generateRandomTasks(seedCount, taskSubject);

      seededTasks.forEach((task) => {
        dispatch({
          type: "ADD_TASK",
          payload: task,
        });
      });

      setTaskSubject("");
      dispatch({ type: "CLEAR_ERRORS" });

      // Show success toast
      toast({
        title: "Tasks Generated",
        description: `Successfully created ${seedCount} new tasks`,
      });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";

      setErrorMessage(errorMsg);
      dispatch({
        type: "SET_ERROR",
        payload: { prompt: errorMsg },
      });

      // Show error toast
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <DropdownMenuContent className="w-64">
        <form
          id="seed-tasks-form"
          onSubmit={handleSeedSubmission}
          className="flex flex-col gap-4 p-4"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="ai-prompt" className="text-sm">
              AI-Generated Task
            </Label>
            <Input
              id="ai-prompt"
              type="text"
              value={taskSubject}
              onChange={(e) => {
                setTaskSubject(e.target.value);
                if (errors.prompt) {
                  dispatch({
                    type: "SET_ERROR",
                    payload: { prompt: undefined },
                  });
                }
              }}
              className={cn(
                "w-full",
                errors.prompt && "border-red-500 focus-visible:ring-red-500",
              )}
              placeholder="Enter task subject"
            />
            {errors.prompt && errors.prompt === "Prompt is required" && (
              <p className="text-sm text-red-500">{errors.prompt}</p>
            )}
          </div>
          <div className="flex w-full space-x-2">
            <Slider
              id="seedSlider"
              min={1}
              max={10}
              step={1}
              value={[seedCount]}
              onValueChange={(value) => setSeedCount(value[0])}
            />
            <Badge variant="secondary">{seedCount}</Badge>
          </div>
          <Button
            form="seed-tasks-form"
            className="w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" /> Generating...
              </>
            ) : (
              <p>
                Add {seedCount} Task{seedCount > 1 ? "s" : ""}{" "}
              </p>
            )}
          </Button>
          {errorMessage && !errors.prompt && (
            <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
          )}
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
