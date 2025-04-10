# AI Commits

AI-powered Git commit message generator using OpenAI.

## Features

- 🤖 Generate meaningful commit messages based on your staged changes
- ✨ Support for conventional commit format
- 🌍 Multiple language support
- 🧠 Configure different OpenAI models (GPT-3.5, GPT-4)
- 🪝 Git hook integration for automatic commit message generation

## Installation

```bash
# Install globally
npm install -g aicommits

# Configure your OpenAI API key
aicommits config set OPENAI_KEY=your-openai-api-key
```

## Usage

```bash
# Stage your changes
git add .

# Generate commit message
aicommits

# Generate multiple suggestions
aicommits -g 3

# Use a specific language
aicommits -l es  # Spanish

# Use a specific model
aicommits -m gpt-3.5-turbo

# Use conventional commit format
aicommits -t conventional

# Limit commit message length
aicommits --max-length 50
```

## Git Hook Integration

You can set up a Git hook to automatically generate commit messages:

```bash
aicommits hook
```

This will install a `prepare-commit-msg` hook in your Git repository.

## Configuration

You can configure various settings:

```bash
# View all config
aicommits config get

# Set number of suggestions to generate by default
aicommits config set generate=3

# Set default language
aicommits config set locale=fr

# Set default model
aicommits config set model=gpt-3.5-turbo

# Set default message type
aicommits config set type=conventional

# Set max length
aicommits config set max-length=72

# Configure proxy
aicommits config set PROXY=http://your-proxy-url

# Configure timeout (in ms)
aicommits config set TIMEOUT=30000

# Delete a config value
aicommits config delete locale
```

## License

MIT
