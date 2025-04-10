import Conf from "conf";

// Configuration interface
interface ConfigOptions {
  generate: number;
  locale: string;
  type: string;
  model: string;
  "max-length": number;
  OPENAI_KEY?: string;
  PROXY?: string;
  TIMEOUT?: number;
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
export function getConfigValue(key: keyof ConfigOptions | string): unknown {
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
  return config.store as Record<string, unknown>;
}
