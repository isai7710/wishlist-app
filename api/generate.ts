import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function generate(
  request: VercelRequest,
  response: VercelResponse,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    if (request.method !== "POST") {
      return response.status(405).json({ error: "Method not allowed" });
    }
    if (!process.env.HUGGING_FACE_API_TOKEN) {
      throw new Error(
        "Hugging Face API token not found in environment variables",
      );
    }

    const { subject } = request.body;
    if (!subject || typeof subject !== "string") {
      return response.status(400).json({
        error: "Invalid subject input provided",
      });
    }

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-2-2b-it",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
          "Content-Type": "application/json",
          "x-use-cache": "false", // disable cache-layer resulting in new query when inputs are the same
        },
        body: JSON.stringify({
          inputs: subject,
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
    if (!hfResponse.ok) {
      const error = await hfResponse.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }
    const result = await hfResponse.json();
    if (!Array.isArray(result) || !result[0]?.generated_text) {
      throw new Error("Invalid response format from Hugging Face API");
    }

    return response.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    return response
      .status(500)
      .json({ error: "Failed to generate task description" });
  } finally {
    clearTimeout(timeoutId);
  }
}
