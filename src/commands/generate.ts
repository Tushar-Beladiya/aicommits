import inquirer from "inquirer";
import chalk from "chalk";
import stringWidth from "string-width";
import ora from "ora";
import {
  isGitRepository,
  hasStagedChanges,
  getStagedDiff,
  createCommit,
} from "../utils/git.js";
import { generateCommitMessages, GenerationOptions } from "../utils/openai.js";

/**
 * Generate commit message for staged changes
 * @param {GenerationOptions} options Options for generation
 * @returns {Promise<void>}
 */
export async function generateCommitMessage(
  options: GenerationOptions = {}
): Promise<void> {
  // Check if we're in a Git repository
  if (!(await isGitRepository())) {
    throw new Error("Not in a Git repository");
  }

  // Check if there are staged changes
  if (!(await hasStagedChanges())) {
    throw new Error(
      "No staged changes found. Use git add to stage files first."
    );
  }

  // Width of the box (including borders and padding)
  const boxWidth = 60;

  function padLine(content = "") {
    const visibleLength = stringWidth(content);
    const totalPadding = boxWidth - 4 - visibleLength; // 4 = borders + 2 spaces
    const rightPadding = " ".repeat(totalPadding);
    return (
      chalk.cyan("│") + " " + content + rightPadding + " " + chalk.cyan("│")
    );
  }

  const topBorder = chalk.cyan("┌" + "─".repeat(boxWidth - 2) + "┐");
  const bottomBorder = chalk.cyan("└" + "─".repeat(boxWidth - 2) + "┘");

  const lines = [
    padLine(), // top padding
    padLine(), // top padding
    padLine(chalk.green.bold("✨ Welcome to AI Commits v0.1.6 ✨")),
    padLine(),
    padLine(chalk.yellow("Generate professional commit messages")),
    padLine(chalk.yellow("powered by OpenAI's GPT models")),
    padLine(),
    padLine(chalk.blue("➜ Analyzes your code changes intelligently")),
    padLine(chalk.blue("➜ Creates clear, concise commit messages")),
    padLine(chalk.blue("➜ Follows best practices automatically")),
    padLine(), // bottom padding
    padLine(), // bottom padding
  ];

  console.log([topBorder, ...lines, bottomBorder].join("\n"));

  // Get staged diff
  const spinner = ora("Fetching staged changes...").start();
  const diff = await getStagedDiff();

  if (!diff) {
    spinner.fail("No changes to commit");
    return;
  }

  spinner.text = "Generating commit message with OpenAI...";

  try {
    // Generate commit messages
    const messages = await generateCommitMessages(diff, options);
    spinner.succeed("Generated commit message suggestions");

    // Display the suggestions
    console.log("\n📝 Commit message suggestions:");
    messages.forEach((message, index) => {
      console.log(`\n${chalk.cyan(`[${index + 1}]`)} ${message}`);
    });

    // Ask the user which message to use
    const { selection } = await inquirer.prompt<{ selection: number }>([
      {
        type: "list",
        name: "selection",
        message: "Choose a commit message:",
        choices: [
          ...messages.map((msg, idx) => ({
            name: `${idx + 1}. ${
              msg.length > 50 ? msg.substring(0, 50) + "..." : msg
            }`,
            value: idx,
          })),
          { name: "Enter custom message", value: -1 },
          { name: "Cancel", value: -2 },
        ],
      },
    ]);

    // Handle user selection
    if (selection === -2) {
      console.log(chalk.yellow("Commit cancelled"));
      return;
    }

    let commitMessage: string;

    if (selection === -1) {
      // User wants to enter a custom message
      const { customMessage } = await inquirer.prompt<{
        customMessage: string;
      }>([
        {
          type: "input",
          name: "customMessage",
          message: "Enter your commit message:",
          validate: (input: string) =>
            input.trim().length > 0 || "Commit message cannot be empty",
        },
      ]);
      commitMessage = customMessage;
    } else {
      // User selected one of the generated messages
      commitMessage = messages[selection];
    }

    // Confirm the commit
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: "confirm",
        name: "confirm",
        message: `Commit with message: "${commitMessage}"?`,
        default: true,
      },
    ]);

    if (confirm) {
      spinner.text = "Creating commit...";
      spinner.start();
      await createCommit(commitMessage);
      spinner.succeed("Commit created successfully");
    } else {
      console.log(chalk.yellow("Commit cancelled"));
    }
  } catch (error) {
    spinner.fail(`Error: ${(error as Error).message}`);
    throw error;
  }
}
