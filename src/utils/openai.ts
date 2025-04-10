import OpenAI from "openai";
import { getConfigValue } from "./config.js";

// Options for generation
export interface GenerationOptions {
  generate?: string | number;
  locale?: string;
  model?: string;
  type?: string;
  "max-length"?: string | number;
}

/**
 * Get an instance of the OpenAI client
 * @returns {OpenAI} The OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = getConfigValue("OPENAI_KEY") as string;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not configured. Run: aicommits config set OPENAI_KEY=your-key"
    );
  }

  const config: OpenAI.ClientOptions = {
    apiKey,
  };

  // Add proxy if configured
  const proxy = getConfigValue("PROXY") as string;
  if (proxy) {
    config.baseURL = proxy;
  }

  // Add timeout if configured
  const timeout = getConfigValue("TIMEOUT") as string | number;
  if (timeout) {
    config.timeout = parseInt(timeout as string, 10);
  }

  return new OpenAI(config);
}

/**
 * Generate a commit message from a diff
 * @param {string} diff The Git diff
 * @param {GenerationOptions} options Options for generation
 * @returns {Promise<string[]>} The generated commit messages
 */
export async function generateCommitMessages(
  diff: string,
  options: GenerationOptions = {}
): Promise<string[]> {
  const client = getOpenAIClient();

  const numSuggestions = parseInt(
    (options.generate as string) || (getConfigValue("generate") as string),
    10
  );
  const model =
    (options.model as string) || (getConfigValue("model") as string);
  const locale =
    (options.locale as string) || (getConfigValue("locale") as string);
  const type = (options.type as string) || (getConfigValue("type") as string);
  const maxLength = options["max-length"] || getConfigValue("max-length");

  // Build the prompt
  let prompt = `Given the following git diff, generate a concise and descriptive commit message`;

  if (type === "conventional") {
    prompt += ` in the conventional commit format (type: subject)`;
  }

  if (locale && locale !== "en") {
    prompt += ` in ${locale} language`;
  }

  if (maxLength) {
    prompt += `. The message should be at most ${maxLength} characters`;
  }

  prompt += `.\n\n${diff}`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates concise and meaningful Git commit messages based on diffs.",
        },
        { role: "user", content: prompt },
      ],
      n: numSuggestions,
      temperature: 0.7,
    });

    return response.choices.map((choice) => choice.message.content.trim());
  } catch (error) {
    throw new Error(`OpenAI API error: ${(error as Error).message}`);
  }
}
