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
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useWishlist } from "@/hooks/use-wishlist";
import { WishItem } from "@/lib/wishes/types";

export default function BulkActions() {
  const { state, dispatch } = useWishlist();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAction = (action: () => void, errorMessage: string) => {
    if (state.selectedWishes.length === 0) {
      toast({
        variant: "destructive",
        title: errorMessage,
      });
      return;
    }
    action();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between pt-3 px-3">
      <div className="flex flex-col items-center mb-4 gap-1 sm:mb-0">
        <Button
          variant={state.ui.bulkSelectionMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => dispatch({ type: "TOGGLE_BULK_SELECTION_MODE" })}
        >
          <span
            className={state.ui.bulkSelectionMode ? "font-bold" : "font-medium"}
          >
            Bulk Actions
          </span>
        </Button>
        <AnimatePresence>
          {state.ui.bulkSelectionMode && (
            <motion.p
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              {state.selectedWishes.length} wish
              {state.selectedWishes.length !== 1 ? "s" : ""} selected
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        <AnimatePresence>
          {state.ui.bulkSelectionMode &&
            [
              <Button
                onClick={() =>
                  handleAction(
                    () => dispatch({ type: "CLEAR_SELECTED" }),
                    "No wishes selected!",
                  )
                }
                variant="outline"
                size="sm"
                className="p-2"
              >
                <span className="hidden lg:block">Clear Selection</span>
                <SquareDashedMousePointer />
              </Button>,
              <Button
                onClick={() => {
                  if (state.wishItems.length === 0) {
                    toast({
                      variant: "destructive",
                      title: "No wishes available to select",
                    });
                  }
                  dispatch({ type: "TOGGLE_SELECT_ALL" });
                }}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <span className="hidden lg:block">
                  {state.selectedWishes.length === state.wishItems.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
                <SquareMousePointer />
              </Button>,
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={(open) => {
                  if (open && state.selectedWishes.length === 0) {
                    toast({
                      variant: "destructive",
                      title: "Select wishes to update please",
                    });
                    return;
                  }
                  setIsDropdownOpen(open);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    Update
                    <ArrowDownNarrowWide className="translate-y-[1px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Low", "Medium", "High"].map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() =>
                        handleAction(() => {
                          dispatch({
                            type: "BULK_UPDATE_PRIORITY",
                            payload: priority as WishItem["priority"],
                          });
                          toast({
                            title: `Updated ${state.selectedWishes.length} wish${
                              state.selectedWishes.length > 1 ? "es" : ""
                            } to ${priority} priority`,
                          });
                          setIsDropdownOpen(false);
                        }, "Select wishes to update please")
                      }
                    >
                      Set to {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>,
              <Button
                onClick={() =>
                  handleAction(
                    () => dispatch({ type: "BULK_MARK_AS_COMPLETE" }),
                    "Select wishes please",
                  )
                }
                variant="outline"
                size="sm"
                className="flex p-2"
              >
                <span className="hidden lg:block">Mark Complete</span>
                <ListCheck />
              </Button>,
              <Button
                onClick={() =>
                  handleAction(
                    () => dispatch({ type: "BULK_MARK_AS_INCOMPLETE" }),
                    "Select wishes please",
                  )
                }
                variant="outline"
                size="sm"
                className="flex p-2"
              >
                <span className="hidden lg:block">Mark Incomplete</span>
                <ListX />
              </Button>,
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={(e) => {
                      if (state.selectedWishes.length === 0) {
                        e.preventDefault();
                        toast({
                          variant: "destructive",
                          title: "No wishes selected!",
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
                      You are about to delete {state.selectedWishes.length}{" "}
                      selected wish
                      {state.selectedWishes.length !== 1 ? "es" : ""}. This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary" className="bg-accent">
                        Go Back
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          dispatch({ type: "BULK_DELETE" });
                          toast({
                            title: `Deleted ${state.selectedWishes.length} wish${state.selectedWishes.length > 1 ? "es" : ""}`,
                          });
                        }}
                        variant="destructive"
                      >
                        I'm sure
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>,
            ].map((button, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: -0.8, opacity: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                {button}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
