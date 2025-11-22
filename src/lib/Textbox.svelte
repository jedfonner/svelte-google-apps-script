<script lang="ts">
  interface FieldProps {
    value: string;
  }
  let { value = $bindable(), onChange } = $props();

  let isEditable = $state(false);

  function handleOnKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'Enter') {
      isEditable = false;
      onChange && onChange();
    } else if (event.key == 'Escape') {
      isEditable = false;
    }
  }
</script>

{#if isEditable}
  <!-- svelte-ignore a11y_autofocus -->
  <input
    class="field editable"
    type="text"
    bind:value
    autofocus
    onfocusout={() => {
      isEditable = false;
      onChange && onChange();
    }}
    onkeydown={handleOnKeyDown}
  />
{:else}
  <div
    class="field display"
    role="button"
    tabindex="0"
    title="Click to edit"
    onclick={() => (isEditable = true)}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        isEditable = true;
      }
    }}
  >
    {value}
  </div>
{/if}

<style>
  .field.display {
    min-width: 50px;
    min-height: 50%;
    cursor: pointer;
  }
  .field.editable {
    width: 90%;
  }
</style>
