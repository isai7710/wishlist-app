import { WishItem, WishlistState } from "@/lib/wishes/types";

const PROMPT_TEMPLATE = `You are a wish description generator. Generate a single, clear wish no more than 10 words in length based on the subject provided. Subject: {subject}`;

// calls the api/ route to generate a wish description for the given subject
export async function fetchWish(subject: string = "Electronics") {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate wish, API Error: ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.result || typeof data.result !== "string") {
      throw new Error("No valid wish returned from API");
    }
    return (
      data.result
        .trim()
        // Remove quotes and asterisks
        .replace(/["*`]/g, "")
        // Ensure it ends with a period
        .replace(/[.]*$/, ".")
        // Remove multiple spaces
        .replace(/\s+/g, " ")
        .trim()
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out - please try again");
      }
      throw new Error(`Failed to generate task: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generates random wishes with Hugging Face Inference API
 */
export async function generateAIWishes(
  count: number = 5,
  subject: string = "Electronics",
): Promise<Omit<WishItem, "id" | "createdAt">[]> {
  // Input validation
  if (count < 1) throw new Error("Count must be at least 1");
  if (!subject.trim()) throw new Error("Prompt cannot be empty");

  // 'tasks' is an array of promises, it doesn't hold final data
  // each promise in this array represents a 'task' that is ongoing or will resolve into a wish
  const tasks = Array.from({ length: count }, async (_, index) => {
    try {
      const enhancedPrompt = PROMPT_TEMPLATE.replace("{subject}", subject);
      const wish = await fetchWish(enhancedPrompt);

      const priorities: WishItem["priority"][] = [
        "Low",
        "Low",
        "Medium",
        "Medium",
        "High",
      ];
      const priority: WishItem["priority"] =
        priorities[Math.floor(Math.random() * priorities.length)];

      return {
        wish,
        priority,
        completed: false,
      };
    } catch (error) {
      console.error(`Error generating task ${index + 1}:`, error);
      // we need to make sure error case returns the same type
      return {
        wish: `Failed to generate task ${index + 1}`,
        priority: "Medium" as WishItem["priority"],
        completed: false,
      };
    }
  });
  // once "Promise.all()" resolves, we get our actual real array of 'wishes'
  const wishes = await Promise.all(tasks);

  // Filter out any failed wishes
  return wishes.filter(
    (wishItem) => !wishItem.wish.startsWith("Failed to generate"),
  );
}

/**
 * Filters wishes based on selected priority levels and completion status
 * @param wishes - Array of all wish items
 * @param filter - Current filter state containing priorities and status
 * @returns Filtered array of wishes that match the current filter criteria
 */
export function getFilteredWishes(
  wishes: WishItem[],
  filter: WishlistState["filter"],
) {
  // Return all wishes if no filters are applied
  if (filter.priorities.length === 0 && filter.status === null) {
    return wishes;
  }

  // filter function maps through items in array and returns new array with item that passes criteria (returns true) we define within
  return wishes.filter((wish) => {
    // Exclude wish if its priority isn't in the selected priorities
    if (
      filter.priorities.length > 0 &&
      !filter.priorities.includes(wish.priority)
    ) {
      return false;
    }

    // Handle status filtering
    if (filter.status === "Active") {
      // we only want incomplete wishes in this case, so keep any wish that has
      // completed property as false (in which case !wish.completed returns true)
      return !wish.completed;
    }
    if (filter.status === "Completed") {
      return wish.completed; // same process as before, only keep completed wishes (wish.complete returns true)
    }

    // if we reach this point then there were no filter options set so we can simply return all wishes
    return true;
  });
}
