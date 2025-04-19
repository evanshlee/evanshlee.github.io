@echo off
echo Building site...

:: Make sure we're in the project root directory
cd /d "%~dp0\.."

:: Create dist directory if it doesn't exist
if not exist dist mkdir dist

:: Install marked inside the dist directory
echo Installing marked in dist folder...
call npm install marked --prefix ./dist
if %ERRORLEVEL% NEQ 0 (
  echo Error installing dependencies.
  echo Try manually running: npm install marked --prefix ./dist
  exit /b %ERRORLEVEL%
)

:: Use our custom converter script with NODE_PATH set to dist/node_modules
echo Converting Markdown files...
set NODE_PATH=dist\node_modules
call node scripts\convert.js
if %ERRORLEVEL% NEQ 0 (
  echo Error converting files.
  exit /b %ERRORLEVEL%
)

echo Build complete! Output is in the ./dist directory.
echo To preview the site, run: npx serve dist
