import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Blocks } from "lucide-react";
import { TaskAction } from "@/lib/tasks/types";
import { generateRandomTasks } from "@/lib/tasks/utils";

interface TaskSeederProps {
  dispatch: React.Dispatch<TaskAction>;
}

export default function TaskSeeder({ dispatch }: TaskSeederProps) {
  const [seedCount, setSeedCount] = useState<number>(5);
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
  );
}
