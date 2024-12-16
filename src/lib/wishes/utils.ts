import { WishItem, WishlistState } from "@/lib/wishes/types";

const PROMPT_TEMPLATE = `You are a wish description generator for a wishlist app. Generate a single, clear wish description based on the subject provided.

Subject: {subject}

Requirements:
1. A wish can be any physical product (like clothing, electronics, office stationaries, etc.), a vacation destination, a digital service/product, etc.
2. Include only plain text - no quotes, asterisks, or special characters
3. Write exactly one sentence
4. End with a period
5. Use 10 words or fewer
6. Be specific and actionable
7. Use professional language
8. Do not include any labels, prefixes, or metadata

Respond with only the wish description, nothing else. Do not explain or add context.`;

export async function generateWishText(subject: string = "Electronics") {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject: subject }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate description: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result[0]?.generated_text) {
      throw new Error("No generated text received");
    }
    return (
      result[0].generated_text
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
 * Generates random tasks with Hugging Face Inference API
 */
export async function generateRandomWishes(
  count: number = 5,
  subject: string = "Electronics",
): Promise<Omit<WishItem, "id" | "createdAt">[]> {
  // Input validation
  if (count < 1) throw new Error("Count must be at least 1");
  if (!subject.trim()) throw new Error("Prompt cannot be empty");

  // create an array of promises for concurrent execution
  const wishes = await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      try {
        const enhancedPrompt = PROMPT_TEMPLATE.replace("{subject}", subject);
        const wish = await generateWishText(enhancedPrompt);

        const priorities: WishItem["priority"][] = [
          "Low",
          "Low",
          "Medium",
          "Medium",
          "High",
        ];
        const priority: WishItem["priority"] =
          priorities[Math.floor(Math.random() * priorities.length)];

        // explicitly type the return object so typescript won't get angry at us
        const wishItem: Omit<WishItem, "id" | "createdAt"> = {
          wish,
          priority,
          completed: false,
        };

        return wishItem;
      } catch (error) {
        console.error(`Error generating task ${index + 1}:`, error);
        // we need to make sure error case returns the same type
        const fallbackWish: Omit<WishItem, "id" | "createdAt"> = {
          wish: `Failed to generate task ${index + 1}`,
          priority: "Medium" as WishItem["priority"],
          completed: false,
        };
        return fallbackWish;
      }
    }),
  );

  // Filter out any failed wishes (optional)
  return wishes.filter((wish) => !wish.wish.startsWith("Failed to generate"));
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
