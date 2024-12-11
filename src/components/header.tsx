import { Button } from "@/components/ui/button";
import { Sun, Moon, CheckSquare } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-background w-full max-w-4xl mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <CheckSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Task Priority Manager</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
    </header>
  );
}
