import Conf from "conf";

// Default configuration values
const defaults = {
  generate: 1,
  locale: "en",
  type: "conventional",
  model: "gpt-4",
  "max-length": 72,
};

// Get the configuration instance
export function getConfig() {
  return new Conf({
    projectName: "aicommits",
    defaults,
  });
}

// Get a specific configuration value
export function getConfigValue(key) {
  const config = getConfig();
  return config.get(key);
}

// Set a configuration value
export function setConfigValue(key, value) {
  const config = getConfig();
  config.set(key, value);
}

// Get all configuration values
export function getAllConfig() {
  const config = getConfig();
  return config.store;
}
