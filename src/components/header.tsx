import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { state, dispatch } = useWishlist();
  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Wishlist App</h1>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
        >
          {state.ui.darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
    </header>
  );
}
