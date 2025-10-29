<script module>
  export const PIs = ['25.1', '25.2', '25.3', '25.4', '25.5', '25.6'];
  export const ROW_START_INDEX = 3; // Because of header row
  export const COLUMN_START_INDEX = 4; // Because of title, owner, status columns
</script>

<script lang="ts">
  import type { RoadmapItem } from "../types";
  import Dropdown from "./Dropdown.svelte";
  import Textbox from "./Textbox.svelte";
  import TimelineBar from "./TimelineBar.svelte";

  interface Props {
    items: RoadmapItem[];
  }

  let { items = $bindable() }: Props = $props();

  let owners = $derived(getAllOwners(items));

  let idLevelMap = $derived.by(() => {
      const map = new Map<string, number>();
      items.forEach(item => {
        if (!item.parentId) {
          map.set(item.id, 0);
        } else if (map.has(item.parentId)) {
          const parentLevel = map.get(item.parentId) ?? 1;
          map.set(item.id, parentLevel+1);
        }
      });

      return map;
    }
  );
  $inspect('items', items);
  $inspect('idLevelMap', idLevelMap);

  let filter = $state({
    title: '',
    owner: '',
    status: ''
  })

  const STATUS_OPTIONS = [
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  async function updateSpreadsheet(item:RoadmapItem): Promise<boolean> {
    console.log('Updating item in spreadsheet:', item);
    try {
      // @ts-ignore
      await google.script.run.withSuccessHandler((response:boolean) => {
        console.log('Server response:', response);
        return response;
      }).withFailureHandler((error:any) => {
        console.error('Error updating spreadsheet:', error);
      }).updateSpreadsheet(item);
    } catch (error) {
      console.error('Error invoking server function:', error);
    }
    return false;
  }

  function getAllOwners(items: RoadmapItem[]): string[] {
    const ownersSet = new Set<string>();
    items.filter(item =>!!item.owner).forEach(item => ownersSet.add(item.owner!));
    return Array.from(ownersSet);
  }

  let filteredItems = $derived.by(() => {
    return items.filter(item => {
      const matchesTitle = filter.title === '' || item.title.toLowerCase().includes(filter.title.toLowerCase());
      const matchesOwner = filter.owner === '' || item.owner === '' || item.owner === filter.owner;
      const matchesStatus = filter.status === '' || item.status === '' || item.status === filter.status;
      return matchesTitle && matchesOwner && matchesStatus;
    });
  });


</script>
<div class="roadmap">
  <!-- Header Row -->
  <div class="header" style="grid-row: 1; grid-column: 1;">Title</div>
  <div class="header" style="grid-row: 1; grid-column: 2;">Owner</div>
  <div class="header" style="grid-row: 1; grid-column: 3;">Status</div>
  {#each PIs as quarter, i}
    <div class="header pi" style="grid-row: 1; grid-column: {i+COLUMN_START_INDEX};">{quarter}</div>
  {/each}
  <!-- Filter Row-->
  <div class="filter title" style="grid-row: 2; grid-column: 1;">
    <input type="text" placeholder="Filter titles..."  bind:value={filter.title}/>
    <input type="button" value="X" onclick={() => filter.title = ''} disabled={!filter.title}/>
  </div>
  <div class="filter" style="grid-row: 2; grid-column: 2;">
    <select style="width: 90%;" bind:value={filter.owner} >
      <option value="">All Owners</option>
      {#each owners as owner}
        <option value="{owner}">{owner}</option>
      {/each}
    </select>
  </div>
  <div class="filter" style="grid-row: 2; grid-column: 3;">
    <select style="width: 90%;" bind:value={filter.status}>
      <option value="">All Statuses</option>
      <option value="planned">Planned</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
  </div>
  {#each PIs as _, i}
    <div class="filter" style="grid-row: 2; grid-column: {i+COLUMN_START_INDEX};">&nbsp;</div>
  {/each}

  <!-- Background cells -->
  {#each filteredItems as item, index}
    {@const level = idLevelMap.get(item.id) ?? 0}
    <!-- Title -->
    {#if level === 0}
      <div class="cell title level-{level}" style="grid-row: {index+ROW_START_INDEX}; grid-column: 1 / -1;">
          ↳&nbsp;<Textbox bind:value={item.title} onChange={() => updateSpreadsheet(item)} />
      </div>
    {:else}
      <div class="cell title level-{level}" style="grid-row: {index+ROW_START_INDEX}; grid-column: 1;">
          ↳&nbsp;<Textbox bind:value={item.title} onChange={() => updateSpreadsheet(item)} />
      </div>
    {/if}
    {#if level > 0} <!-- don't show any cells for top-level items -->
      <!-- Owner -->
      <div class="cell owner" style="grid-row: {index+ROW_START_INDEX}; grid-column: 2;">
        <Textbox bind:value={item.owner} onChange={() => updateSpreadsheet(item)}/>
      </div>
      <!-- Status -->
      <div class="cell status {item.status}" style="grid-row: {index+ROW_START_INDEX}; grid-column: 3;">
      <Dropdown bind:value={item.status} options={STATUS_OPTIONS} onChange={() => updateSpreadsheet(item)}/>
      </div>
      <!-- Blank PI cells -->
      {#each PIs as _, i}
        <div class="cell pi-cell" style="grid-row: {index+ROW_START_INDEX}; grid-column: {i+COLUMN_START_INDEX};"></div>
      {/each}
    {/if}
  {/each}

  <!-- Timeline bars - overlay on top -->
  {#each filteredItems as item, index}
    {@const level = idLevelMap.get(item.id) ?? 0}
    {#if level > 0}
      <!-- ignore warnings about binding to non-reactive property-->
      <TimelineBar bind:startPi={item.startPi} bind:endPi={item.endPi} status={item.status} {index} onChange={() => updateSpreadsheet(item)} />
    {/if}
  {/each}

</div>
<style>
  .roadmap {
    display: grid;
    grid-template-columns: 300px 150px 150px repeat(6, 1fr);
    grid-auto-rows: 40px;
    gap: 1px;
    background-color: #ddd;
    font-size: 14px;
    overflow: auto;
    height: 100%;
    width: 100%;
  }

  .header {
    background-color: #2c3e50;
    color: white;
    padding: 12px 8px;
    font-weight: bold;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header.pi {
    background-color: #34495e;
  }
  .filter {
    background-color: #f4f4f4;
    padding: 8px;
  }
  .filter.title {
    display: grid;
    grid-template-columns: auto 20px;
    gap: 4px;
  }
  .cell {
    background-color: white;
    color: navy;
    padding-left: 8px;
    display: flex;
    align-items: center;
    /* overflow: hidden; */
    position: relative;
    z-index: 1;
  }

  .cell.title {
    font-weight: 500;
  }
  .cell.title.level-0 {
    background-color: #e0e9ff;
    grid-column: 1 / -1;
  }
  .cell.owner {
    color: #333333;
  }
  .cell.status.completed {
    color: green;
  }
  .cell.status.planned {
    color: gray;
  }
  .cell.pi-cell {
    background-color: #f9f9f9;
  }
  .cell.level-0 {
    font-size: 1.1rem;
    min-height: 50px;
  }
  .cell.level-1 {
    font-size: 1rem;
    padding-left: 1rem;

  }
  .cell.level-2 {
    padding-left: 1.5rem;
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