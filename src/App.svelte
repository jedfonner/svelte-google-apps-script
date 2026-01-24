<script lang="ts">
  // import svelteLogo from './assets/svelte.svg';
  // import gasLogo from './assets/appsscript.svg';
  import Counter from './lib/Counter.svelte';
  import ServerDrivenComponent from './lib/ServerDrivenComponent.svelte';
</script>

<main>
  <div>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src="./svelte.svg" class="logo svelte" alt="Svelte Logo" />
    </a>
    <a href="https://developers.google.com/apps-script/" target="_blank" rel="noreferrer">
      <img src="./appsscript.svg" class="logo gas" alt="Google Apps Script Logo" />
    </a>
  </div>
  <h1>Svelte + Google Apps Script</h1>
  <p class="read-the-docs">
    Click on the logos to learn more about the respective technologies
  </p>

  <div class="card">
    <Counter />
  </div>
  <div class="card">
    <ServerDrivenComponent />
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
