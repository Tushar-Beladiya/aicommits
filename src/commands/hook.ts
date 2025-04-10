import { Command } from "commander";
import chalk from "chalk";
import { setupGitHook } from "../utils/git.js";

export function hookCommand(program: Command): void {
  program
    .command("hook")
    .description("Set up Git hooks for auto-generating commit messages")
    .argument(
      "[hook-type]",
      "Type of hook (default: prepare-commit-msg)",
      "prepare-commit-msg"
    )
    .action(async (hookType: string) => {
      try {
        await setupGitHook(hookType);
        console.log(chalk.green(`✅ Git ${hookType} hook set up successfully`));
        console.log(
          chalk.blue("Now aicommits will automatically run when you commit!")
        );
      } catch (error) {
        console.error(
          chalk.red(`Error setting up Git hook: ${(error as Error).message}`)
        );
        process.exit(1);
      }
    });
}
