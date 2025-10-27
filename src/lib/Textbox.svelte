<script lang="ts">
  interface FieldProps {
    value: string;
  }
  let { value = $bindable() } = $props();

  let isEditable = $state(false);
</script>
{#if isEditable}
  <!-- svelte-ignore a11y_autofocus -->
  <input class="field editable" type="text" bind:value={value}
        autofocus
        onfocusout={() => isEditable = false}
        onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); isEditable = false; }}} />
{:else}
  <div class="field display" role="button" tabindex="0"
    onclick={() => isEditable = true}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); isEditable = true; } }} >
    {value}
  </div>
{/if}

<style>
  .field.display {
    cursor: pointer;
  }
  .field {
    width:90%;
  }
</style>