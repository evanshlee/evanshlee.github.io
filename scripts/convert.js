const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
  console.log("Created dist directory");
}

// Create HTML template
function createHtml(title, content, section = null) {
  let nav = "";
  if (section) {
    nav = `<p><a href="/">← Home</a> | <a href="/${section}/">← ${
      section.charAt(0).toUpperCase() + section.slice(1)
    }</a></p>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <style>
      body {
        font-family: sans-serif;
        max-width: 700px;
        margin: auto;
        padding: 2rem;
        line-height: 1.6;
      }
      h1 { color: #222; font-size: 2rem; }
      h2 { color: #444; }
      a { text-decoration: none; color: #0077cc; }
      a:hover { text-decoration: underline; }
      .emoji { font-size: 1.4rem; margin-right: 0.4rem; }
      ul { list-style: none; padding: 0; }
      li { margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    ${nav}
    ${content}
  </body>
</html>`;
}

// Process a markdown file
function convertFile(mdPath, outputPath) {
  try {
    console.log(`Processing: ${mdPath}`);

    // Read the file
    let mdContent = fs
      .readFileSync(mdPath, "utf8")
      .replace(/^\/\/ filepath:.*?\n/, "") // Remove filepath comment
      .replace(/^<!-- filepath:.*?-->\n/, ""); // Remove HTML filepath comment

    // Replace .md links with .html links
    mdContent = mdContent.replace(/\]\(([^)]+)\.md\)/g, "]($1.html)");

    // Convert to HTML
    const htmlContent = marked(mdContent);

    // Get section for navigation
    let section = null;
    const isIndex = path.basename(mdPath) === "index.md";
    const parentDir = path.dirname(mdPath);
    if (!isIndex || parentDir !== ".") {
      section = path.basename(parentDir);
    }

    // Get title
    let title = path.basename(mdPath, ".md");
    if (isIndex && parentDir === ".") {
      title = "My Dev Notes";
    }

    // Create full HTML
    const fullHtml = createHtml(title, htmlContent, section);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(outputPath, fullHtml);
    console.log(`Created: ${outputPath}`);

    return outputPath;
  } catch (err) {
    console.error(`Error processing ${mdPath}:`, err);
    return null;
  }
}

// Find all markdown files
console.log("Starting conversion process...");
let count = 0;

// Process index.md
if (fs.existsSync("index.md")) {
  convertFile("index.md", "dist/index.html");
  count++;
}

// Process section indexes and articles
const sections = ["notes", "posts", "reflections"];
sections.forEach((section) => {
  if (fs.existsSync(section)) {
    // Create section directory in dist
    const sectionDir = `dist/${section}`;
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }

    // Process index.md for section
    const sectionIndex = `${section}/index.md`;
    if (fs.existsSync(sectionIndex)) {
      convertFile(sectionIndex, `${sectionDir}/index.html`);
      count++;
    }

    // Process other md files in section
    try {
      const files = fs.readdirSync(section);
      files.forEach((file) => {
        if (file.endsWith(".md") && file !== "index.md") {
          const mdPath = `${section}/${file}`;
          const htmlFile = file.replace(".md", ".html");
          const outputPath = `${sectionDir}/${htmlFile}`;
          convertFile(mdPath, outputPath);
          count++;
        }
      });
    } catch (err) {
      console.error(`Error processing section ${section}:`, err);
    }
  }
});

console.log(`Conversion complete. Processed ${count} files.`);
console.log('Output is in the "dist" directory.');
