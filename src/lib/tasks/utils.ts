import { TaskItem, TasksState } from "@/lib/tasks/types";

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

/**
 * Filters tasks based on selected priority levels and completion status
 * @param tasks - Array of all task items
 * @param filter - Current filter state containing priorities and status
 * @returns Filtered array of tasks that match the current filter criteria
 */
export function getFilteredTasks(
  tasks: TaskItem[],
  filter: TasksState["filter"],
) {
  // Return all tasks if no filters are applied
  if (filter.priorities.length === 0 && filter.status === null) {
    return tasks;
  }

  // filter function maps through items in array and returns new array with item that passes criteria (returns true) we define within
  return tasks.filter((task) => {
    // Exclude task if its priority isn't in the selected priorities
    if (
      filter.priorities.length > 0 &&
      !filter.priorities.includes(task.priority)
    ) {
      return false;
    }

    // Handle status filtering
    if (filter.status === "Active") {
      // we only want incomplete tasks in this case, so keep any task that has
      // completed property as false (in which case !task.completed returns true)
      return !task.completed;
    }
    if (filter.status === "Completed") {
      return task.completed; // same process as before, only keep completed tasks (task.complete returns true)
    }

    // if we reach this point then there were no filter options set so we can simply return all tasks
    return true;
  });
}
