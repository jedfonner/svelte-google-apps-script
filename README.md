# Svelte + Google Apps Script

This demonstrates how to use Svelte with Google Apps Script.

## Building

1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the project.
3. Copy the contents of the `gas` folder into your Google Apps Script project.
4. Create a new "web app" deployment in Google Apps Script

## How to extend
- Add your Svelte components in the `src/lib` folder.
- Import and use them in `src/App.svelte`.
- If you need to call Google Apps Script functions from Svelte, use the [google.script.run](https://developers.google.com/apps-script/guides/html/reference/run#code.gs) API. See `testInvokationFromClient` example in Apps.svelte
