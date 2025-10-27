<script lang="ts">
  interface Option {
    label: string;
    value: string;
  }
  interface FieldProps {
    options: Option[];
    value: string;
  }
  let { options, value = $bindable(), onChange } = $props();

  function getDisplayValue(value: string): string {
    const option = options.find((opt: { value: string; }) => opt.value === value);
    return option ? option.label : value;
  }

  let isEditable = $state(false);
</script>

{#if isEditable}
  <!-- svelte-ignore a11y_autofocus -->
  <select class="dropdown editable"  bind:value={value}
        onfocusout={() => {isEditable = false; onChange && onChange()}}
        onkeydown={(e) => { console.log("keydown", e.key); if (e.key === 'Enter') { e.preventDefault(); isEditable = false; onChange && onChange()}}}
        onchange={() => {isEditable = false; onChange && onChange()}}
        >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
{:else}
  <div class="dropdown display" role="button" tabindex="0"
    onclick={() => isEditable = true}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); isEditable = true; } }} >
    {getDisplayValue(value)}
  </div>
{/if}

<style>
  .dropdown.display {
    cursor: pointer;
  }
  .dropdown {
    width:90%;
  }
</style>