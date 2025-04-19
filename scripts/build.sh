#!/bin/bash

# Install marked if it's not already installed
echo "Installing dependencies..."
npx --yes marked@4

# Run our converter script
echo "Converting Markdown to HTML..."
node scripts/convert.js

echo "Build complete! Output is in the ./dist directory."
echo "To preview the site, run: npx serve dist"
