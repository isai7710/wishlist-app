import { TaskItem } from "@/lib/tasks/types";

const sampleTasks = [
  "Complete project documentation",
  "Review pull requests",
  "Setup development environment",
  "Update dependencies",
  "Write unit tests",
  "Deploy to production",
  "Debug performance issues",
  "Create backup strategy",
  "Implement new feature",
  "Refactor legacy code",
];

const priorities: TaskItem["priority"][] = ["Low", "Medium", "High"];

export function generateRandomTasks(
  count: number = 5,
): Omit<TaskItem, "id" | "createdAt">[] {
  const randomTaskItems = Array.from({ length: count }, () => {
    // Get random task description
    const randomTaskIndex = Math.floor(Math.random() * sampleTasks.length);
    const task = sampleTasks[randomTaskIndex];

    // Get random priority
    const randomPriorityIndex = Math.floor(Math.random() * priorities.length);
    const priority = priorities[randomPriorityIndex];

    const completed = false;

    return {
      task,
      priority,
      completed,
    };
  });

  return randomTaskItems;
}
