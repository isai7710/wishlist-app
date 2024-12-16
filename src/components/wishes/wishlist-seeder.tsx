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
import { WishlistAction, WishlistState } from "@/lib/wishes/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MovingBorder } from "@/components/ui/moving-border";
import { generateRandomWishes } from "@/lib/wishes/utils";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface WishlistSeederProps {
  errors: Partial<WishlistState["errors"]>;
  dispatch: React.Dispatch<WishlistAction>;
}

export default function WishlistSeeder({
  errors,
  dispatch,
}: WishlistSeederProps) {
  const [seedCount, setSeedCount] = useState<number>(5);
  const [wishSubject, setWishSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const borderRadius = "0.4rem";

  const handleSeedSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!wishSubject.trim()) {
      setErrorMessage("Subject is required");
      dispatch({
        type: "SET_ERROR",
        payload: { prompt: "Subject is required" },
      });
      return;
    }

    setIsLoading(true);
    try {
      const seededWishes = await generateRandomWishes(seedCount, wishSubject);

      seededWishes.forEach((wish) => {
        dispatch({
          type: "ADD_WISH",
          payload: wish,
        });
      });

      setWishSubject("");
      dispatch({ type: "CLEAR_ERRORS" });

      // Show success toast
      toast({
        title: "Wishes Generated",
        description: `Successfully created ${seedCount} new wishes with the Hugging Face API`,
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
        <div
          className="bg-transparent relative text-xl h-[38px] w-[38px] p-[1px] overflow-hidden shrink-0"
          style={{
            borderRadius: borderRadius,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
          >
            <MovingBorder duration={3000} rx="30%" ry="30%">
              <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]" />
            </MovingBorder>
          </div>

          <div
            className="relative bg-background border border-input flex items-center justify-center w-full h-full text-sm antialiased shadow-sm hover:bg-accent hover:text-accent-foreground hover:cursor-pointer transition-colors"
            style={{
              borderRadius: `calc(${borderRadius} * 0.96)`,
            }}
          >
            <Blocks className="w-5 h-5" strokeWidth={1.7} />
          </div>
        </div>
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
              value={wishSubject}
              onChange={(e) => {
                setWishSubject(e.target.value);
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
                Add {seedCount} Wish{seedCount > 1 ? "es" : ""}
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
