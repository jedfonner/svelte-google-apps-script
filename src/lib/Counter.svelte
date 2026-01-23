<script lang="ts">
  let count: number = $state(0);
  const increment = () => {
    count += 1;
  };
</script>

<p>Typical Svelte state works - click to increment</p>
<button onclick={increment}>
  Count is {count}
</button>
