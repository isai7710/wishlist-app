import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDownNarrowWide,
  ListCheck,
  ListX,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { TaskAction, TaskItem, TasksState } from "@/lib/tasks/types";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

interface BulkActionProps {
  selectedTasks: TasksState["selectedTasks"];
  tasks: TaskItem[];
  dispatch: React.Dispatch<TaskAction>;
  bulkSelectionMode: boolean;
  setBulkSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BulkActions({
  selectedTasks,
  tasks,
  dispatch,
  bulkSelectionMode,
  setBulkSelectionMode,
}: BulkActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between pt-3 px-3">
      <div className="flex flex-col items-center mb-4 gap-1 sm:mb-0">
        <Button
          variant={bulkSelectionMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => setBulkSelectionMode(!bulkSelectionMode)}
          className={bulkSelectionMode ? "border border-accent" : ""}
        >
          <span className={bulkSelectionMode ? "font-bold" : "font-medium"}>
            Bulk Actions
          </span>
        </Button>
        <AnimatePresence>
          {bulkSelectionMode && (
            <motion.p
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              {selectedTasks.length} task
              {selectedTasks.length > 1 || selectedTasks.length === 0
                ? "s"
                : ""}{" "}
              selected
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {bulkSelectionMode && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Button
              onClick={() => {
                if (selectedTasks.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "No tasks selected!",
                  });
                  return;
                }
                dispatch({ type: "CLEAR_SELECTED" });
                toast({
                  title: "Selection cleared.",
                });
              }}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <span className="hidden sm:block">Clear</span>
              <SquareDashedMousePointer />
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: "TOGGLE_SELECT_ALL" });
              }}
              variant="outline"
              size="sm"
              className="p-2"
            >
              {selectedTasks.length === tasks.length ? (
                <>
                  <span className="hidden sm:block">Clear All</span>
                  <SquareMousePointer />
                </>
              ) : (
                <>
                  <span className="hidden sm:block">Select All</span>
                  <SquareMousePointer />
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                if (selectedTasks.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "Select tasks please",
                  });
                  return;
                }
                dispatch({ type: "BULK_MARK_AS_COMPLETE" });
                toast({
                  title: `Marked ${selectedTasks.length} item${selectedTasks.length > 1 ? "s" : ""} as completed`,
                });
              }}
              variant="outline"
              size="sm"
              className="flex p-2"
            >
              <ListCheck />
            </Button>
            <Button
              onClick={() => {
                if (selectedTasks.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "Select tasks please",
                  });
                  return;
                }
                dispatch({ type: "BULK_MARK_AS_INCOMPLETE" });
                toast({
                  title: `Marked ${selectedTasks.length} item${selectedTasks.length > 1 ? "s" : ""} as incomplete`,
                });
              }}
              variant="outline"
              size="sm"
              className="flex p-2"
            >
              <ListX />
            </Button>
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={(open) => {
                if (open && selectedTasks.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "Select tasks to update please",
                  });
                  return;
                }
                setIsDropdownOpen(open);
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                  <span className="hidden sm:block">Update</span>
                  <ArrowDownNarrowWide className="translate-y-[1px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    dispatch({
                      type: "BULK_UPDATE_PRIORITY",
                      payload: "Low",
                    });
                    toast({
                      title: `Successfully updated ${selectedTasks.length} task priorit${selectedTasks.length > 1 ? "ies" : "y"} to Low`,
                    });
                  }}
                >
                  Set to Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    dispatch({
                      type: "BULK_UPDATE_PRIORITY",
                      payload: "Medium",
                    });
                    toast({
                      title: `Successfully updated ${selectedTasks.length} task priorit${selectedTasks.length > 1 ? "ies" : "y"} to Medium`,
                    });
                  }}
                >
                  Set to Medium
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    dispatch({
                      type: "BULK_UPDATE_PRIORITY",
                      payload: "High",
                    });
                    toast({
                      title: `Successfully updated ${selectedTasks.length} task priorit${selectedTasks.length > 1 ? "ies" : "y"} to High`,
                    });
                  }}
                >
                  Set to High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    if (selectedTasks.length === 0) {
                      e.preventDefault();
                      toast({
                        variant: "destructive",
                        title: "No tasks selected!",
                      });
                      return;
                    }
                  }}
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                >
                  Delete
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    You are about to delete all selected tasks. This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary" className="bg-accent">
                      Go Back.
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        dispatch({ type: "BULK_DELETE" });
                        toast({
                          title: `Successfully deleted ${selectedTasks.length} task${selectedTasks.length > 1 ? "s" : ""}`,
                        });
                      }}
                      variant="destructive"
                    >
                      I'm sure.
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
