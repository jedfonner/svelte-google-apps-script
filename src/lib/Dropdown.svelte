<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

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
    const option = options.find((opt: { value: string }) => opt.value === value);
    return option ? option.label : value;
  }
  function handleOnKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'Enter') {
      isEditable = false;
      onChange && onChange();
    } else if (event.key == 'Escape') {
      isEditable = false;
    }
  }

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        isEditable = false;
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }
  function selectKeydown(node: HTMLElement) {
    document.addEventListener('keydown', handleOnKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown, true);
    };
  }

  let isEditable = $state(false);
</script>

{#if isEditable}
  <!-- svelte-ignore a11y_autofocus -->
  <select
    bind:value
    {@attach clickOutside}
    {@attach selectKeydown}
    class="dropdown editable"
    onchange={() => {
      isEditable = false;
      onChange && onChange();
    }}
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
{:else}
  <div
    class="dropdown display"
    role="button"
    tabindex="0"
    title="Click to edit"
    onclick={() => (isEditable = true)}
    onkeydown={handleOnKeyDown}
  >
    {getDisplayValue(value)}
  </div>
{/if}

<style>
  .dropdown.display {
    cursor: pointer;
  }
  .dropdown {
    width: 90%;
  }
</style>
