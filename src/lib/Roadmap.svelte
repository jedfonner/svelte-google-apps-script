<script lang="ts">
  import type { RoadmapItem } from "../types";

  interface Props {
    items: RoadmapItem[];
  }

  let { items }: Props = $props();

  let owners = $derived(getAllOwners(items));

  let filter = $state({
    title: '',
    owner: ''
  })

  const PIs = ['25.1', '25.2', '25.3', '25.4', '25.5', '25.6'];

  // Function to get grid column span for a timeline bar
  function getColumnSpan(startPi: string, endPi: string): { start: number; end: number } {
    const startIndex = PIs.indexOf(startPi);
    const endIndex = PIs.indexOf(endPi);

    return {
      start: startIndex >= 0 ? startIndex + 3 : 3, // +3 to account for title, owner columns
      end: endIndex >= 0 ? endIndex + 4 : 9 // +4 to span to end of that column
    };
  }

  // Flatten the tree structure to display all items
  function flattenItems(items: RoadmapItem[], level = 0): Array<RoadmapItem & { level: number }> {
    let result: Array<RoadmapItem & { level: number }> = [];
    for (const item of items) {
      result.push({ ...item, level });
      if (item.children && item.children.length > 0) {
        result = result.concat(flattenItems(item.children, level + 1));
      }
    }
    return result;
  }

  function getAllOwners(items: RoadmapItem[]): string[] {
    const ownersSet = new Set<string>();
    function extractOwners(items: RoadmapItem[]) {
      for (const item of items) {
        if (item.owner) {
          ownersSet.add(item.owner);
        }
        if (item.children && item.children.length > 0) {
          extractOwners(item.children);
        }
      }
    }
    extractOwners(items);
    return Array.from(ownersSet);
  }

  const flatItems = $derived(flattenItems(items));

  let filteredItems = $derived.by(() => {
    return flatItems.filter(item => {
      const matchesTitle = filter.title === '' || item.title.toLowerCase().includes(filter.title.toLowerCase());
      const matchesOwner = filter.owner === '' || item.owner === '' || item.owner === filter.owner;
      return matchesTitle && matchesOwner;
    });
  });

  const ROW_START_INDEX = 3; // Because of header row

</script>
<div class="roadmap">
  <!-- Header Row -->
  <div class="header" style="grid-row: 1; grid-column: 1;">Title</div>
  <div class="header" style="grid-row: 1; grid-column: 2;">Owner</div>
  {#each PIs as quarter, i}
    <div class="header pi" style="grid-row: 1; grid-column: {i+3};">{quarter}</div>
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
  {#each PIs as _, i}
    <div class="filter" style="grid-row: 2; grid-column: {i+3};">&nbsp;</div>
  {/each}

  <!-- Background cells -->
  {#each filteredItems as item, index}
  {#if item.level === 0}
    <div class="cell title level-{item.level}" style="grid-row: {index+ROW_START_INDEX}; grid-column: 1 / -1;">
        ↳&nbsp;{item.title}
    </div>
    {:else}
    <div class="cell title level-{item.level}" style="grid-row: {index+ROW_START_INDEX}; grid-column: 1;">
        ↳&nbsp;{item.title}
    </div>
    {/if}
    {#if item.level > 0} <!-- don't show any cells for top-level items -->
      <div class="cell owner" style="grid-row: {index+ROW_START_INDEX}; grid-column: 2;">{item.owner}</div>
      {#each PIs as _, i}
        <div class="cell pi-cell" style="grid-row: {index+ROW_START_INDEX}; grid-column: {i+3};"></div>
      {/each}
    {/if}
  {/each}

  <!-- Timeline bars - overlay on top -->
  {#each filteredItems as item, index}
    {#if item.level > 0}
      <div class="timeline-bar status-{item.status}"
        style="grid-row: {index+ROW_START_INDEX}; grid-column: {getColumnSpan(item.startPi, item.endPi).start} / {getColumnSpan(item.startPi, item.endPi).end};">
        <div class="timeline-label">{item.startPi} → {item.endPi}</div>
      </div>
    {/if}
  {/each}

</div>
<style>
  .roadmap {
    display: grid;
    grid-template-columns: 300px 150px repeat(6, 1fr);
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

  .timeline-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    z-index: 10;
    margin: 2px;
  }

  .timeline-bar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .timeline-bar.status-planned {
    background: linear-gradient(135deg, #a2a9ba 0%, #a2a9ba 100%);
  }

  .timeline-bar.status-in-progress {
    background: linear-gradient(135deg, #7ea8f5 0%, #518eff 100%);
  }

  .timeline-bar.status-completed {
    background: linear-gradient(135deg, #4bbd50 0%, #00c10a 100%);
  }

  .timeline-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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