import Conf from "conf";

// Configuration interface
export interface ConfigOptions {
  generate?: number;
  locale?: string;
  type?: string;
  model?: string;
  "max-length"?: number;
  OPENAI_KEY?: string;
  PROXY?: string;
  TIMEOUT?: number;
  // Add an index signature to allow any string key
  [key: string]: string | number | undefined;
}

// Default configuration values
const defaults: ConfigOptions = {
  generate: 1,
  locale: "en",
  type: "conventional",
  model: "gpt-4",
  "max-length": 72,
};

// Get the configuration instance
export function getConfig(): Conf<ConfigOptions> {
  return new Conf<ConfigOptions>({
    projectName: "aicommits",
    defaults,
  });
}

// Get a specific configuration value
export function getConfigValue(key: string): unknown {
  const config = getConfig();
  return config.get(key);
}

// Set a configuration value
export function setConfigValue(key: string, value: unknown): void {
  const config = getConfig();
  config.set(key, value);
}

// Get all configuration values
export function getAllConfig(): Record<string, unknown> {
  const config = getConfig();
  // No need for type assertion since ConfigOptions now has an index signature
  return config.store;
}
