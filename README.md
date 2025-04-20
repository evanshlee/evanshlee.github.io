# evanshlee.github.io

## How it works

This blog is built using a simple but powerful system:

1. **Content in Markdown**: All content is written in Markdown files (`.md`) for ease of writing and version control
2. **Zero dependencies**: No heavy frameworks or build tools required - marked.js and prism.js are included internally
3. **Automatic conversion**: GitHub Actions automatically converts Markdown to HTML during deployment
4. **GitHub Pages**: The site is hosted on GitHub Pages from the `gh-pages` branch
5. **Syntax Highlighting**: Code blocks are automatically highlighted using Prism.js

## Directory Structure

```text
├── content/                # All site content
│   ├── notes/              # Quick learning logs
│   │   ├── index.md        # Notes section index
│   │   └── *.md            # Individual notes
│   ├── posts/              # Long-form writing
│   │   ├── index.md        # Posts section index
│   │   └── *.md            # Individual posts
│   └── reflections/        # Personal reflections
│       ├── index.md        # Reflections section index
│       └── *.md            # Individual reflections
├── styles/                 # CSS styling
│   ├── main.css            # Main stylesheet for the site
│   └── prism-theme.css     # Syntax highlighting styles
├── scripts/                # Utility scripts
│   ├── convert.js          # Markdown to HTML converter
│   ├── build.bat           # Windows build script
│   └── build.sh            # Unix build script
├── lib/                    # Internal libraries
│   ├── marked/             # Embedded marked.js for Markdown parsing
│   └── prism/              # Prism.js for syntax highlighting
├── index.md                # Main landing page
└── .github/workflows/      # GitHub Actions
    └── build-and-deploy.yml # Automated build and deployment
```

## Local Development

To preview the site locally:

1. On Windows:

   ```bash
   # Use one of these methods:
   scripts\build.bat
   # OR
   cd scripts && build.bat && cd ..
   ```

2. On Unix/Mac/Linux:

   ```bash
   chmod +x ./scripts/build.sh  # Make the script executable (first time only)
   ./scripts/build.sh
   ```

If you encounter any issues:

- Check if the dist directory was created: `dir dist` (Windows) or `ls dist` (Unix)
- Try running with verbose output: `node --trace-warnings scripts/convert.js`

## Automatic Deployment

When you push changes to the `main` branch:

1. GitHub Actions runs the workflow defined in `.github/workflows/build-and-deploy.yml`
2. The workflow converts all Markdown files to HTML using the embedded marked.js library
3. The generated HTML files are deployed to the `gh-pages` branch
4. GitHub Pages serves the content from the `gh-pages` branch

This process ensures you can write in Markdown while visitors see properly formatted HTML pages.

## Features

### Syntax Highlighting

Code blocks with language identifiers are automatically syntax highlighted:

````text
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

The above will render with JavaScript syntax highlighting.

Supported languages include JavaScript, Python, CSS, HTML, Bash, and many more.
