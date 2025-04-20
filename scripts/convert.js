const fs = require("fs");
const path = require("path");
const { marked } = require("./lib/marked.js");

const OUTPUT_DIR = "dist";
const TEMPLATES_DIR = "templates";
const STYLES_SOURCE_DIR = "styles";
const CONTENT_SOURCE_DIR = "content";

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("✅ Created output directory");
}

// Create styles directory in output
const outputStylesDir = path.join(OUTPUT_DIR, "styles");
if (!fs.existsSync(outputStylesDir)) {
  fs.mkdirSync(outputStylesDir, { recursive: true });
}
fs.copyFileSync(
  path.join(STYLES_SOURCE_DIR, "main.css"),
  path.join(outputStylesDir, "main.css")
);
console.log("✅ Copied CSS to output/styles");

/**
 * Loads a template file from the templates directory
 * @param {string} templateFileName - Name of the template file to load
 * @returns {string} Contents of the template file
 */
function loadTemplate(templateFileName) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, templateFileName), "utf8");
}
const baseTemplate = loadTemplate("base.html");
let navigationTemplate = "";
try {
  navigationTemplate = loadTemplate("partials/navigation.html");
} catch (err) {
  // optional partial
}

/**
 * Renders a template by replacing {{#if}}, {{key}} placeholders with actual values
 * @param {string} templateText - The template string containing placeholders
 * @param {Object} data - Data object with values to replace placeholders
 * @returns {string} The rendered template
 */
function renderTemplate(templateText, data) {
  // Handle conditional blocks
  let result = templateText.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, inner) => (data[key] ? inner : "")
  );
  // Replace regular placeholders
  return result.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
}

/**
 * Builds a complete HTML page by combining templates with content
 * @param {string} pageTitle - Title for the page
 * @param {string} pageContent - Main content HTML
 * @param {string|null} currentSection - Current section name for navigation
 * @returns {string} Complete HTML page
 */
function buildHtmlPage(pageTitle, pageContent, currentSection = null) {
  // Use navigation partial if section is provided
  let navigationHtml = "";
  if (currentSection && navigationTemplate) {
    const navData = {
      section: currentSection,
      sectionTitle:
        currentSection.charAt(0).toUpperCase() + currentSection.slice(1),
    };
    navigationHtml = renderTemplate(navigationTemplate, navData);
  }
  return renderTemplate(baseTemplate, {
    title: pageTitle,
    navigation: navigationHtml,
    content: pageContent,
    showSuffix: !!currentSection,
  });
}

// Configure marked to add IDs to headings
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      // Extract text from tokens
      const text = tokens
        .map((token) => {
          if (typeof token === "string") {
            return token;
          } else if (token.text) {
            return token.text;
          } else {
            return "";
          }
        })
        .join("");

      // Create slug from heading text
      const slug = text
        .toLowerCase()
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ""); // Remove extra hyphens from start/end

      // Ensure level is a valid heading level (1-6)
      const validDepth =
        Number.isInteger(depth) && depth >= 1 && depth <= 6 ? depth : 1;

      // Return clean HTML without extra whitespace and with validated level
      return `<h${validDepth} id="${slug}"><a href="#${slug}" class="heading-anchor">${text}</a></h${validDepth}>`;
    },
  },
});

/**
 * Converts a Markdown file to HTML and writes it to the target path
 * @param {string} sourcePath - Path to the source Markdown file
 * @param {string} targetPath - Path to the target HTML file
 * @returns {string|null} Path to the created HTML file or null if an error occurred
 */
function processMarkdownFile(sourcePath, targetPath) {
  try {
    console.log(`📄 Processing: ${sourcePath}`);

    // Read the file
    let mdContent = fs
      .readFileSync(sourcePath, "utf8")
      .replace(/^\/\/ filepath:.*?\n/, "") // Remove filepath comment
      .replace(/^<!-- filepath:.*?-->\n/, ""); // Remove HTML filepath comment

    // Replace .md links with .html links
    mdContent = mdContent.replace(/\]\(([^)]+)\.md\)/g, "]($1.html)");

    // Convert to HTML
    const htmlBody = marked(mdContent);

    // Get section for navigation
    let sectionName = null;
    const isIndex = path.basename(sourcePath) === "index.md";
    const parentDir = path.dirname(sourcePath);
    if (!isIndex || parentDir !== ".") {
      sectionName = path.basename(parentDir);
    }

    // Get title: special homepage, folder index → folder name, else filename
    let resolvedTitle;
    if (isIndex) {
      if (parentDir === ".") {
        resolvedTitle = "evanshlee";
      } else {
        resolvedTitle =
          sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
      }
    } else {
      resolvedTitle = path.basename(sourcePath, ".md");
    }

    // Create full HTML
    const fullHtml = buildHtmlPage(resolvedTitle, htmlBody, sectionName);

    // Ensure output directory exists
    const outputDir = path.dirname(targetPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(targetPath, fullHtml);
    console.log(`✅ Created: ${targetPath}`);

    return targetPath;
  } catch (err) {
    console.error(`❌ Error processing ${sourcePath}:`, err);
    return null;
  }
}

/**
 * Recursively traverses the content directory and processes Markdown files
 * @param {string} dir - Directory to traverse
 */
function traverseContentDirectory(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const src = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverseContentDirectory(src);
    } else if (entry.isFile() && src.endsWith(".md")) {
      const rel = path.relative(CONTENT_SOURCE_DIR, src);
      const dest = path.join(OUTPUT_DIR, rel).replace(/\.md$/, ".html");
      processMarkdownFile(src, dest);
      fileCount++;
    }
  });
}

// Start the conversion process
console.log("🚀 Starting conversion...");
// Counter for processed files
let fileCount = 0;

// Process root index.md
if (fs.existsSync("index.md")) {
  processMarkdownFile("index.md", path.join(OUTPUT_DIR, "index.html"));
  fileCount++;
}

// Process all MD files in content folder if it exists
if (fs.existsSync(CONTENT_SOURCE_DIR)) {
  traverseContentDirectory(CONTENT_SOURCE_DIR);
}

console.log(`🎉 Conversion complete. Processed ${fileCount} files.`);
