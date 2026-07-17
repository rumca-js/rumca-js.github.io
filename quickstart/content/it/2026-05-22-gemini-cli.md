+++
title = "Gemini Cli on raspberry PI"
date = 2025-09-30 18:43:32
draft = false
+++

# Install
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y

# Verify
node -v
npm -v

# Install gemini
npm install -g @google/gemini-cli
