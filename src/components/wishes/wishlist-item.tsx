import { Badge } from "@/components/ui/badge";
import { WishItem } from "@/lib/wishes/types";
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
import { useWishlist } from "@/hooks/use-wishlist";

interface WishlistItemProps {
  wish: WishItem;
}

export default function WishlistItem({ wish }: WishlistItemProps) {
  const { state, dispatch } = useWishlist();
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md hover:text-accent-foreground transition-colors">
      <AnimatePresence>
        {state.ui.bulkSelectionMode && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            className="flex"
          >
            <Checkbox
              checked={state.selectedWishes.includes(wish.id)}
              onClick={() =>
                dispatch({
                  type: "TOGGLE_SELECT",
                  payload: wish.id,
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
          if (!state.ui.bulkSelectionMode) {
            dispatch({ type: "TOGGLE_BULK_SELECTION_MODE" });
          }
          dispatch({ type: "TOGGLE_SELECT", payload: wish.id });
        }}
        className={cn(
          "flex-grow cursor-pointer",
          wish.completed ? "text-muted-foreground" : "",
        )}
      >
        <div className="flex items-center space-x-2">
          <p
            className={`text-md font-medium ${wish.completed ? "line-through" : ""}`}
          >
            {wish.wish}
          </p>
          {wish.completed && (
            <p className="flex items-center gap-1 text-xs text-green-500">
              Completed <Check className="w-3 h-3" />
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {wish.createdAt.toDateString()}
        </p>
      </div>
      <Badge variant="secondary" className="text-xs shadow-none">
        {wish.priority}
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
                payload: wish.id,
              });
            }}
          >
            Mark as {`${wish.completed ? "incomplete" : "completed"}`}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set Priority</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: wish.id, priority: "Low" },
                    })
                  }
                >
                  <span>Low</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: wish.id, priority: "Medium" },
                    })
                  }
                >
                  <span>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PRIORITY",
                      payload: { id: wish.id, priority: "High" },
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
                type: "DELETE_WISH",
                payload: wish.id,
              });
              toast({
                title: "Successfully deleted wish",
              });
            }}
          >
            <span className="text-red-500">Delete Wish</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
