<script lang="ts">
  let {
    itemId,
    expanded = $bindable(true),
    toggleVisibility,
  }: {
    itemId: string;
    expanded?: boolean;
    toggleVisibility?: (itemId: string, isVisible: boolean) => void;
  } = $props();

  function toggle(e: Event) {
    e.preventDefault();
    expanded = !expanded;
    if (toggleVisibility) toggleVisibility(itemId, expanded);
  }
</script>

{#if expanded}
  <button
    class="toggle {expanded}"
    onclick={toggle}
    onkeydown={toggle}
    aria-expanded={expanded}>▼</button
  >
{:else}
  <button
    class="toggle {expanded}"
    onclick={toggle}
    onkeydown={toggle}
    aria-expanded={expanded}>▶</button
  >
{/if}

<style>
  button {
    all: unset;
    display: inline-block;
    margin-right: 4px;
  }
  .toggle {
    cursor: pointer;
    user-select: none;
    font-size: 0.9rem;
    line-height: 1rem;
  }
</style>
