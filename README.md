# Svelte + Google Apps Script

This demonstrates how to use Svelte with Google Apps Script using [Clasp](https://developers.google.com/apps-script/guides/clasp) for seamless deployment.

## Prerequisites

- Node.js installed on your machine
- A Google account
- Enable the Google Apps Script API at https://script.google.com/home/usersettings

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Authenticate with Clasp

Login to your Google account:

```bash
npm run clasp:login
```

This will open a browser window for authentication.

### 3. Create or Connect to a Google Apps Script Project

**Option A: Create a new project**

```bash
npm run clasp:create
```

This creates a new Google Apps Script project and generates a `.clasp.json` file with your project credentials.

**Option B: Connect to an existing project**

If you already have a Google Apps Script project, create a `.clasp.json` file in the root directory:

```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "."
}
```

Replace `YOUR_SCRIPT_ID_HERE` with your script ID (found in Project Settings in the Apps Script editor).

### 4. Build and Deploy

Build your Svelte app and push to Google Apps Script:

```bash
npm run deploy
```

This command builds the project and pushes all files to your Apps Script project.

### 5. Deploy as Web App

1. Open your Apps Script project:
   ```bash
   npm run clasp:open
   ```

2. In the Apps Script editor, click **Deploy** > **New deployment**
3. Select type **Web app**
4. Configure access settings as needed
5. Click **Deploy**

## Available Scripts

### Development
- `npm run dev` - Start Vite development server (for local preview)
- `npm run build` - Build the Svelte application
- `npm run preview` - Preview the production build locally
- `npm run check` - Run TypeScript and Svelte checks

### Clasp Commands
- `npm run clasp:login` - Authenticate with Google
- `npm run clasp:logout` - Logout from Google
- `npm run clasp:create` - Create a new Apps Script project
- `npm run clasp:push` - Push code to Apps Script
- `npm run clasp:open` - Open the Apps Script project in browser
- `npm run clasp:deploy` - Create a new deployment
- `npm run clasp:deployments` - List all deployments
- `npm run deploy` - Build and push to Apps Script (recommended)

## How to Extend

- Add your Svelte components in the `src/lib` folder
- Import and use them in `src/App.svelte`
- To call Google Apps Script functions from Svelte, use the [google.script.run](https://developers.google.com/apps-script/guides/html/reference/run#code.gs) API. See the `testInvokationFromClient` example in `App.svelte`
- Server-side functions go in `gas/Code.js`

## Project Structure

```
.
├── gas/                      # Google Apps Script files
│   ├── Code.js              # Server-side Apps Script code
│   ├── Index.html           # Main HTML template
│   ├── Javascript.html      # Generated from build (auto-generated)
│   └── Stylesheet.html      # Generated from build (auto-generated)
├── src/                     # Svelte source files
├── appsscript.json          # Apps Script manifest
├── .claspignore            # Files to ignore when pushing
└── .clasp.json             # Clasp configuration (gitignored)
```

## Learn More

- [Clasp Documentation](https://developers.google.com/apps-script/guides/clasp)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Svelte Documentation](https://svelte.dev/docs)
