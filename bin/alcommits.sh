#!/bin/bash

# Display a nice welcome message
echo -e "\033[1;36m┌─────────────────────────────────────────┐\033[0m"
echo -e "\033[1;36m│                                         │\033[0m"
echo -e "\033[1;36m│\033[0m  \033[1;32m✨ Welcome to AI Commits! ✨\033[0m           \033[1;36m│\033[0m"
echo -e "\033[1;36m│                                         │\033[0m"
echo -e "\033[1;36m│\033[0m  \033[0;33mGenerating smart commit messages\033[0m      \033[1;36m│\033[0m"
echo -e "\033[1;36m│\033[0m  \033[0;33mfor your code changes using AI\033[0m        \033[1;36m│\033[0m"
echo -e "\033[1;36m│                                         │\033[0m"
echo -e "\033[1;36m└─────────────────────────────────────────┘\033[0m"
echo ""

# Execute the original aicommits command with all the arguments
node "$(dirname "$0")/../dist/bin/aicommits.js" "$@" 