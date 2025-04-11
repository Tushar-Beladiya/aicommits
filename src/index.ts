#!/usr/bin/env node
import { Command } from "commander";
import { generateCommitMessage } from "./commands/generate.js";
import { configCommand } from "./commands/config.js";

// Create the command line program
const program = new Command();
// Set up the main program
program
  .name("aicommits")
  .description("AI-powered Git commit message generator")
  .version("0.1.0")
  .action(async (options) => {
    try {
      await generateCommitMessage(options);
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  });

// Add options for the main command
program
  .option(
    "-g, --generate <number>",
    "Number of commit messages to generate",
    "1"
  )
  .option(
    "-t, --type <type>",
    "Type of commit message to generate",
    "conventional"
  )
  .option("-l, --locale <locale>", "Locale to use for commit messages", "en")
  .option("-m, --model <model>", "OpenAI model to use", "gpt-4")
  .option("--max-length <length>", "Maximum length of commit messages", "72");

// Register config subcommands
configCommand(program);

// Parse the command line arguments
program.parse();
