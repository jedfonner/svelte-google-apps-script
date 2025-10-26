<script lang="ts">
  import type { RoadmapItem } from "./types";
  import roadmapData from './roadmap-data.json';
  import Roadmap from './lib/Roadmap.svelte';

  let items: RoadmapItem[] = roadmapData as RoadmapItem[];

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
  <h1>Roadmap</h1>
  <div class="roadmap-container">
    <Roadmap {items} />
  </div>
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

  .roadmap-container {
    flex: 1;
    overflow: auto;
    position: relative;
  }
</style>
