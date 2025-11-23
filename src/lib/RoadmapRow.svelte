<script lang="ts">
  import { ROW_START_INDEX, COLUMN_START_INDEX, STATUS_OPTIONS } from './Config.svelte';
  import type { RoadmapItem } from '../types';
  import Button from './Button.svelte';
  import CollapseToggle from './CollapseToggle.svelte';
  import Textbox from './Textbox.svelte';
  import Dropdown from './Dropdown.svelte';
  import TimelineBar from './TimelineBar.svelte';

  interface Props {
    item: RoadmapItem;
    updateSpreadsheet: (item: RoadmapItem) => Promise<boolean>;
    addChildItem: (parentItem: RoadmapItem) => void;
    removeItem: (item: RoadmapItem) => void;
    toggleVisibility?: (itemId: string, isVisible: boolean) => void;
    index: number;
    level: number;
    computedStatus: string;
    computedDuration: { startPi: string; endPi: string } | null;
    hasChildren: boolean;
    PIs: string[];
  }
  let {
    item = $bindable(),
    updateSpreadsheet,
    addChildItem,
    removeItem,
    toggleVisibility,
    index,
    level,
    computedStatus,
    computedDuration,
    hasChildren,
    PIs,
  }: Props = $props();
</script>

<!-- Title -->
{#if level === 0}
  <div
    class="cell title level-0"
    style="grid-row: {index + ROW_START_INDEX}; grid-column: 1 / 3;"
  >
    <CollapseToggle itemId={item.id} {toggleVisibility} />
    <Textbox bind:value={item.title} onChange={() => updateSpreadsheet(item)} />
    <div class="button">
      <Button
        size="small"
        onclick={() => addChildItem(item)}
        title="Add Child Item"
        style="positive">+</Button
      >
    </div>
  </div>
{:else if level === 1}
  <div
    class="cell title level-1"
    style="grid-row: {index + ROW_START_INDEX}; grid-column: 1 / 3;"
  >
    <CollapseToggle itemId={item.id} {toggleVisibility} />
    <Textbox bind:value={item.title} onChange={() => updateSpreadsheet(item)} />
    <div class="button">
      <Button
        size="small"
        onclick={() => addChildItem(item)}
        title="Add Child Item"
        style="positive">+</Button
      >
    </div>
    {#if !hasChildren}
      <div class="button">
        <Button size="small" onclick={() => removeItem(item)} title="Delete" style="negative"
          >X</Button
        >
      </div>
    {/if}
  </div>
{:else}
  <div
    class="cell title level-{level}"
    style="grid-row: {index + ROW_START_INDEX}; grid-column: 1;"
  >
    <span>‣</span>
    <Textbox bind:value={item.title} onChange={() => updateSpreadsheet(item)} />
    {#if level < 2}
      <div class="button">
        <Button size="small" onclick={() => addChildItem(item)} title="Add" style="positive"
          >+</Button
        >
      </div>
    {/if}
    {#if !hasChildren}
      <div class="button">
        <Button size="small" onclick={() => removeItem(item)} title="Delete" style="negative"
          >X</Button
        >
      </div>
    {/if}
  </div>
  <!-- Owner -->
  <div class="cell owner" style="grid-row: {index + ROW_START_INDEX}; grid-column: 2;">
    <Textbox bind:value={item.owner} onChange={() => updateSpreadsheet(item)} />
  </div>
{/if}

<!-- Status -->
<div
  class="cell status {computedStatus} level-{level}"
  style="grid-row: {index + ROW_START_INDEX}; grid-column: 3;"
>
  {#if level <= 1}
    <span>{STATUS_OPTIONS.filter((item) => item.value === computedStatus)[0]?.label}</span>
  {:else}
    <Dropdown
      bind:value={item.status}
      options={STATUS_OPTIONS}
      onChange={() => updateSpreadsheet(item)}
    />
  {/if}
</div>
<!-- Blank PI cells -->
{#each PIs as _, i}
  <div
    class="cell pi-cell level-{level}"
    style="grid-row: {index + ROW_START_INDEX}; grid-column: {i + COLUMN_START_INDEX};"
  ></div>
{/each}

{#if level <= 1}
  <TimelineBar
    {PIs}
    startPi={computedDuration ? computedDuration.startPi : item.startPi}
    endPi={computedDuration ? computedDuration.endPi : item.endPi}
    status={computedStatus ? computedStatus : item.status}
    {index}
    onChange={() => updateSpreadsheet(item)}
    editable={false}
  />
{:else}
  <!-- ignore warnings about binding to non-reactive property-->
  <TimelineBar
    {PIs}
    bind:startPi={item.startPi}
    bind:endPi={item.endPi}
    status={item.status}
    {index}
    onChange={() => updateSpreadsheet(item)}
  />
{/if}

<style>
  .cell {
    background-color: white;
    color: navy;
    padding-left: 8px;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 4px;
    position: relative;
    z-index: 1;
  }
  .cell.title {
    font-weight: 500;
  }
  .cell.level-0 {
    background-color: #cad8fb;
  }
  .cell.level-1 {
    background-color: #dfe7fb;
  }
  .cell.title {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    padding-right: 4px;
  }
  .cell.owner {
    color: #333333;
  }
  .cell.level-1.status {
    font-size: unset;
  }
  .cell.status.completed {
    color: green;
  }
  .cell.status.planned {
    color: gray;
  }
  .pi-cell {
    background-color: #f9f9f9;
  }
  .cell.title.level-0 {
    font-size: 1.1rem;
  }
  .cell.title.level-1 {
    font-size: 1rem;
    padding-left: 1rem;
  }
  .cell.title.level-2 {
    padding-left: 1.5rem;
  }
  .cell .button {
    visibility: hidden;
  }
  .cell:hover .button {
    visibility: visible;
  }
  @media (max-width: 1200px) {
    .roadmap {
      font-size: 12px;
    }

    .cell {
      padding: 6px;
    }
  }
</style>
