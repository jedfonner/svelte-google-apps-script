# Svelte + Google Apps Script

This demonstrates how to use Svelte with Google Apps Script using [Clasp](https://developers.google.com/apps-script/guides/clasp) for seamless deployment.
This demonstrates how to use Svelte with Google Apps Script.

## Prerequisites

- Node.js installed on your machine
- A Google account
- Enable the Google Apps Script API at https://script.google.com/home/usersettings

## Building
- `npm run build` - Build the Svelte application
- `npm run preview` - Preview the production build locally
- `npm run check` - Run TypeScript and Svelte checks

## Developing

- `npm install` to install dependencies.
- `npm run dev` to start the development server.
- Open `http://localhost:5173` in your browser to see the app.
- Edit the Svelte components in the `src` folder. The app will reload automatically

### Running Locally with Mocked Google Apps Script

To test Google Apps Script interactions locally, the project includes a mock setup that simulates the `google.script.run` API.

To enable the mock setup, ensure that the `mockSetup.ts` file is imported and invoked in your main entry file (`src/main.ts`):

Then add your mock server functions in `src/lib/mocks.ts`.

### Working with Clasp for automated deployment

#### Enable Clasp

Enable the Google Apps Script API: https://script.google.com/home/usersettings

#### Authenticate with Clasp

Login to your Google account:

```bash
npm run clasp:login
```

This will open a browser window for authentication.

#### Create or Connect to a Google Apps Script Project

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
  "rootDir": "gas"
}
```

Replace `YOUR_SCRIPT_ID_HERE` with your script ID (found in Project Settings in the Apps Script editor).

#### Build and Deploy

Build your Svelte app and push to Google Apps Script:

```bash
npm run clasp:push
```

This command builds the project and pushes all files to your Apps Script project.

#### Deploy as Web App

1. Open your Apps Script project:
   ```bash
   npm run clasp:open
   ```

2. In the Apps Script editor, click **Deploy** > **New deployment**
3. Select type **Web app**
4. Configure access settings as needed
5. Click **Deploy**

#### Clasp Commands
- `npm run clasp:login` - Authenticate with Google
- `npm run clasp:logout` - Logout from Google
- `npm run clasp:create` - Create a new Apps Script project
- `npm run clasp:push` - Push code to Apps Script
- `npm run clasp:open` - Open the Apps Script project in browser
- `npm run clasp:deploy` - Create a new deployment
- `npm run clasp:deployments` - List all deployments
- `npm run deploy` - Build and push to Apps Script (recommended)

#### Learn More about Clasp

- [Clasp Documentation](https://developers.google.com/apps-script/guides/clasp)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Svelte Documentation](https://svelte.dev/docs)

## Project Structure

```
.
├── gas/                     # Google Apps Script files
│   ├── appsscript.json      # Apps Script manifest
│   ├── Code.js              # Server-side Apps Script code
│   ├── Index.html           # Main HTML template
│   ├── Javascript.html      # Generated from build (auto-generated, do not edit directly)
│   └── Stylesheet.html      # Generated from build (auto-generated, do not edit directly)
├── src/                     # Svelte source files
│   ├── lib/                 # Svelte components and utilities
│   │   ├── Counter.svelte   # Example Svelte component
│   │   ├── ServerDrivenComponent.svelte  # Example Svelte component interacting with GAS
│   │   ├── mockSetup.ts     # Proxy Mock setup for local testing
│   │   └── mocks.ts         # Add your mock server functions here
│   ├── App.svelte           # Main Svelte component
│   ├── app.css              # Global styles
│   └── main.ts              # Entry point

├── .claspignore             # Files to ignore when pushing
└── .clasp.json              # Clasp configuration (gitignored)
```

The main files you will want to start with are
* gas/Code.js
* src/App.svelte
* src/lib/mocks.ts

## How to extend
- Add your Svelte components in the `src/lib` folder.
- Import and use them in `src/App.svelte`.
- If you need to call Google Apps Script functions from Svelte, use the [google.script.run](https://developers.google.com/apps-script/guides/html/reference/run#code.gs) API. See `testInvokationFromClient` example in `ServerDrivenComponent.svelte`, `mocks.ts` and `Code.js` for reference.
