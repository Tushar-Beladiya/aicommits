import { Command } from "commander";
import chalk from "chalk";
import { configCommand } from "./commands/config.js";
import { generateCommitMessage } from "./commands/generate.js";
import { hookCommand } from "./commands/hook.js";
import { getConfig } from "./utils/config.js";

// Create a new command instance
const program = new Command();

// Set up basic program information
program
  .name("aicommits")
  .description("AI-powered Git commit message generator")
  .version("0.1.0");

// Register commands
configCommand(program);
hookCommand(program);

// Default command (no arguments) generates commit message
program
  .argument("[options...]", "Options to pass to the generator")
  .option(
    "-g, --generate <number>",
    "Number of commit messages to generate",
    "1"
  )
  .option("-l, --locale <locale>", "Locale for the commit message")
  .option("-m, --model <model>", "OpenAI model to use")
  .option("-t, --type <type>", "Type of commit message (conventional, default)")
  .option("--max-length <length>", "Maximum length of commit message")
  .option("--hook", "Run as Git hook", false)
  .action(async (_, options) => {
    try {
      await generateCommitMessage(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Check if OpenAI API key is configured
const config = getConfig();
if (!config.get("OPENAI_KEY")) {
  console.log(chalk.yellow("⚠️  OpenAI API key not configured."));
  console.log(
    chalk.yellow("Please run: aicommits config set OPENAI_KEY=your-key")
  );
}

// Parse command line arguments
program.parse(process.argv);
