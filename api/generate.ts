import type { VercelRequest, VercelResponse } from "@vercel/node";
import { InferenceClient } from "@huggingface/inference";

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

    const token = process.env.HUGGING_FACE_API_TOKEN;
    if (!token) {
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

    const client = new InferenceClient(process.env.HUGGING_FACE_API_TOKEN);
    const chatCompletion = await client.chatCompletion({
      provider: "hf-inference",
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: subject,
        },
      ],
      max_tokens: 512,
    });

    const generatedWish = chatCompletion.choices?.[0]?.message?.content;

    if (!generatedWish) {
      throw new Error(
        "No valid message content returned from Hugging Face API",
      );
    }

    return response.status(200).json({ result: generatedWish });
  } catch (error) {
    console.error("Hugging Face API Error", {
      requestBody: request.body,
      error: error instanceof Error ? error.message : error,
    });
    return response
      .status(500)
      .json({ error: "Failed to generate wish description" });
  } finally {
    clearTimeout(timeoutId);
  }
}
