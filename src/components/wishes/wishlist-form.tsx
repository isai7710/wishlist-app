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
import WishlistSeeder from "@/components/wishes/wishlist-seeder";
import WishlistFilter from "@/components/wishes/wishlist-filter";
import { Plus } from "lucide-react";
import { WishItem, WishlistState, WishlistAction } from "@/lib/wishes/types";
import { cn } from "@/lib/utils";

interface WishlistFormProps {
  errors: WishlistState["errors"];
  dispatch: React.Dispatch<WishlistAction>;
  filter: Partial<WishlistState["filter"]>;
}

export default function WishlistForm({
  errors,
  dispatch,
  filter,
}: WishlistFormProps) {
  const [wishInput, setWishInput] = useState<string>("");
  const [priorityInput, setPriorityInput] = useState<WishItem["priority"] | "">(
    "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<WishlistState["errors"]> = {};
    if (!wishInput.trim()) {
      errors.wish = "Required";
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

    dispatch({
      type: "ADD_WISH",
      payload: {
        wish: wishInput,
        priority: priorityInput as WishItem["priority"],
        completed: false,
      },
    });

    setWishInput("");
    setPriorityInput("");
    dispatch({ type: "CLEAR_ERRORS" });
  };

  return (
    <div className="flex items-start gap-2 w-full">
      <form
        id="add-task-form"
        onSubmit={handleSubmit}
        className="flex gap-2 w-full"
      >
        <div className="flex-grow">
          <Input
            type="text"
            value={wishInput}
            onChange={(e) => {
              setWishInput(e.target.value);
              if (errors.wish) {
                dispatch({
                  type: "SET_ERROR",
                  payload: { wish: undefined },
                });
              }
            }}
            placeholder="Enter a new wishlist item"
            className={cn(
              "flex-grow",
              errors.wish && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.wish && (
            <p className="text-xs sm:text-sm text-red-500">{errors.wish}</p>
          )}
        </div>
        <div>
          <Select
            value={priorityInput}
            onValueChange={(value) => {
              setPriorityInput(value as WishItem["priority"]);
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
                "w-[130px] sm:w-[140px]",
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
      <WishlistSeeder errors={errors} dispatch={dispatch} />
      <WishlistFilter filter={filter} dispatch={dispatch} />
    </div>
  );
}
