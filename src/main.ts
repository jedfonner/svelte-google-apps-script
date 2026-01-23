import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';
// import { mockGoogleScriptRun } from './lib/mockGoogleScriptRun';
import { setupMock } from './lib/mockGoogleScriptRun';

/// <reference path="./custom-types.d.ts" />
// if (import.meta.env.DEV) {
//   (window as any).google = {
//     script: {
//       run: mockGoogleScriptRun.run,
//     },
//   };
// }
if (import.meta.env.DEV) {
  setupMock();
}

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
