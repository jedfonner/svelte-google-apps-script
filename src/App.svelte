<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import gasLogo from './assets/appsscript.svg'
  import Counter from './lib/Counter.svelte'

  const invokeServerFunction = async () => {
    try {
      // @ts-ignore
      const result = await google.script.run.withSuccessHandler((response) => {
        console.log('Server response:', response);
        alert('Server function invoked successfully!');
      }).withFailureHandler((error:any) => {
        console.error('Error invoking server function:', error);
        alert('Failed to invoke server function.');
      }).testInvokationFromClient(); // Replace 'serverFunction' with your actual server function name
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  }
</script>

<main>
  <div>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
    <a href="https://developers.google.com/apps-script/" target="_blank" rel="noreferrer">
      <img src={gasLogo} class="logo gas" alt="Google Apps Script Logo" />
    </a>

  </div>
  <h1>Svelte + Google Apps Script</h1>

  <div class="card">
    <Counter />
  </div>
  <div class="card">
    <button onclick={invokeServerFunction}>Invoke Server Function</button>
  </div>

  <p class="read-the-docs">
    Click on the logos to learn more
  </p>
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
