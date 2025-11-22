<script lang="ts">
  import type { RoadmapItem } from './types';
  import Roadmap from './lib/Roadmap.svelte';
  import { onMount } from 'svelte';

  // @ts-ignore
  const version = __APP_VERSION__;

  let status = $state('loading');
  let items: RoadmapItem[] = $state([]);

  onMount(() => {
    getDataFromServer();
  });

  const getDataFromServer = async () => {
    // @ts-ignore
    if (!globalThis.inGAS) {
      console.warn('Not running in GAS environment. Loading local data.');
      try {
        import('./roadmap-data.json').then((module) => {
          items = module.default as RoadmapItem[];
          status = 'loaded';
        });
      } catch (jsonError) {
        console.error('Error loading local JSON data:', jsonError);
        status = 'error';
      }
      return;
    }
    // @ts-ignore
    await google.script.run
      .withSuccessHandler((response: any) => {
        console.log('Loaded data from Spreadsheet', response);
        status = 'loaded';
        items = structuredClone(response) as RoadmapItem[];
      })
      .withFailureHandler((error: any) => {
        console.error('Error invoking server function:', error);
        alert('Failed to invoke server function.');
      })
      .getRoadmapData();
  };
</script>

<main>
  <h1>Roadmap v{version}</h1>
  {#if status === 'loading'}
    <p>Loading...</p>
  {:else if status === 'error'}
    <p>Error loading data.</p>
  {:else}
    <div class="roadmap-container">
      <Roadmap bind:items />
    </div>
  {/if}
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  h1 {
    flex-shrink: 0;
    margin: 0;
    padding: 1rem;
  }
  p {
    padding: 1rem;
  }
  .roadmap-container {
    flex: 1;
    overflow: auto;
    position: relative;
  }
</style>
