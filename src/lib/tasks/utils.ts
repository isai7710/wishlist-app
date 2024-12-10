import { TaskItem, TasksState } from "@/lib/tasks/types";

const HUGGING_FACE_TOKEN = import.meta.env.VITE_HUGGING_FACE_API_TOKEN;
const TIMEOUT = 10000;

export async function generateTaskText(
  prompt: string = "Generate a single concise development task:",
) {
  if (!HUGGING_FACE_TOKEN) {
    throw new Error(
      "Hugging Face API token not found in environment variables",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-2-2b-it",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
          "x-use-cache": "false", // disable cache-layer resulting in new query when inputs are the same
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result[0]?.generated_text) {
      throw new Error("No generated text received");
    }
    return result[0].generated_text
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out - please try again");
      }
      throw new Error(`Failed to generate task: ${error.message}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generates random tasks with Hugging Face Inference API
 */
export async function generateRandomTasks(
  count: number = 5,
  subject: string = "Software",
): Promise<Omit<TaskItem, "id" | "createdAt">[]> {
  // Input validation
  if (count < 1) throw new Error("Count must be at least 1");
  if (!subject.trim()) throw new Error("Prompt cannot be empty");

  // create an array of promises for concurrent execution
  const tasks = await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      try {
        const enhancedPrompt = `Create a short task description that starts with a verb in present tense and ends with a period. Format: "Verb + task description". 
        Subject: ${subject}
        Rules:
        - Must be a single sentence
        - Must start with an action verb
        - Must be specific and actionable
        - Maximum 15 words
        - Must end with a period
        - No prefixes like "Task:" or similar
        - Professional tone

        Example format: "Design a logo for the new coffee shop brand."
        Your response must only contain the task description, nothing else.`;
        const task = await generateTaskText(enhancedPrompt);

        const priorities: TaskItem["priority"][] = [
          "Low",
          "Low",
          "Medium",
          "Medium",
          "High",
        ];
        const priority: TaskItem["priority"] =
          priorities[Math.floor(Math.random() * priorities.length)];

        // explicitly type the return object so typescript won't get angry at us
        const taskItem: Omit<TaskItem, "id" | "createdAt"> = {
          task,
          priority,
          completed: false,
        };

        return taskItem;
      } catch (error) {
        console.error(`Error generating task ${index + 1}:`, error);
        // we need to make sure error case returns the same type
        const fallbackTask: Omit<TaskItem, "id" | "createdAt"> = {
          task: `Failed to generate task ${index + 1}`,
          priority: "Medium" as TaskItem["priority"],
          completed: false,
        };
        return fallbackTask;
      }
    }),
  );

  // Filter out any failed tasks (optional)
  return tasks.filter((task) => !task.task.startsWith("Failed to generate"));
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
