import chalk from "chalk";
import { getConfig, setConfigValue, getAllConfig } from "../utils/config.js";

export function configCommand(program) {
  program
    .command("config")
    .description("Manage configuration for aicommits")
    .addCommand(
      program
        .createCommand("set")
        .description("Set a configuration value")
        .argument(
          "<key>=<value>",
          "Key-value pair to set (e.g., OPENAI_KEY=sk-xxx)"
        )
        .action((keyValue) => {
          const match = keyValue.match(/^([^=]+)=(.*)$/);

          if (!match) {
            console.error(chalk.red("Invalid format. Use KEY=VALUE"));
            return;
          }

          const [, key, value] = match;
          setConfigValue(key, value);
          console.log(chalk.green(`✅ Set ${key} to ${value}`));
        })
    )
    .addCommand(
      program
        .createCommand("get")
        .description("Get a configuration value")
        .argument("[key]", "Configuration key to get")
        .action((key) => {
          const config = getConfig();

          if (key) {
            const value = config.get(key);
            if (value === undefined) {
              console.log(chalk.yellow(`No configuration found for ${key}`));
            } else {
              // Mask sensitive values like API keys
              const displayValue = key.includes("KEY")
                ? `${value.substring(0, 4)}...${value.substring(
                    value.length - 4
                  )}`
                : value;
              console.log(`${key}=${displayValue}`);
            }
          } else {
            // Show all configuration values
            const allConfig = getAllConfig();
            for (const [k, v] of Object.entries(allConfig)) {
              // Mask sensitive values
              const displayValue = k.includes("KEY")
                ? `${v.substring(0, 4)}...${v.substring(v.length - 4)}`
                : v;
              console.log(`${k}=${displayValue}`);
            }
          }
        })
    )
    .addCommand(
      program
        .createCommand("delete")
        .description("Delete a configuration value")
        .argument("<key>", "Configuration key to delete")
        .action((key) => {
          const config = getConfig();
          config.delete(key);
          console.log(chalk.green(`✅ Deleted ${key}`));
        })
    );
}
