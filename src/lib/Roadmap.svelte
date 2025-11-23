<script lang="ts">
  import type { RoadmapItem } from '../types';
  import { COLUMN_START_INDEX } from './Config.svelte';
  import RoadmapRow from './RoadmapRow.svelte';

  interface Props {
    items: RoadmapItem[];
  }

  let { items = $bindable() }: Props = $props();

  let owners = $derived(getAllOwners(items));

  let PIs = $derived.by(() => {
    // Extract unique PIs from items
    const piSet = new Set<string>();
    items.forEach((item) => {
      if (item.startPi) piSet.add(item.startPi);
      if (item.endPi) piSet.add(item.endPi);
    });
    // Sort PIs
    return Array.from(piSet).sort();
  });

  let idLevelMap = $derived.by(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (!item.parentId) {
        map.set(item.id, 0);
      } else if (map.has(item.parentId)) {
        const parentLevel = map.get(item.parentId) ?? 1;
        map.set(item.id, parentLevel + 1);
      }
    });

    return map;
  });
  $inspect('items', items);
  $inspect('idLevelMap', idLevelMap);

  let filter = $state({
    title: '',
    owner: '',
    status: '',
  });

  let hiddenItems = $state([] as string[]);

  let filteredItems = $derived.by(() => {
    return items.filter((item) => {
      const isCollapsed = hiddenItems.includes(item.parentId);
      const matchesTitle =
        filter.title === '' || item.title.toLowerCase().includes(filter.title.toLowerCase());
      const matchesOwner =
        filter.owner === '' || item.owner === '' || item.owner === filter.owner;
      const matchesStatus =
        filter.status === '' || item.status === '' || item.status === filter.status;
      return !isCollapsed && matchesTitle && matchesOwner && matchesStatus;
    });
  });

  function toggleVisibility(itemId: string, isVisible: boolean): void {
    console.log('Toggling collapse for item:', itemId, isVisible);
    if (!isVisible) {
      hiddenItems = [...hiddenItems, itemId];
    } else {
      hiddenItems = hiddenItems.filter((id) => id !== itemId);
    }

    items.forEach((item) => {
      if (item.parentId === itemId) {
        toggleVisibility(item.id, isVisible);
      }
    });
  }

  async function updateSpreadsheet(item: RoadmapItem): Promise<boolean> {
    console.log('Updating item in spreadsheet:', $state.snapshot(item));
    // @ts-ignore
    if (!globalThis.inGAS) {
      console.warn('Not running in GAS environment. Skipping update.');
      return false;
    }
    try {
      // @ts-ignore
      await google.script.run
        .withSuccessHandler((response: boolean) => {
          console.log(`Spreadsheet ${response ? 'successfully updated' : 'failed to update'}`);
          return response;
        })
        .withFailureHandler((error: any) => {
          console.error('Error updating spreadsheet:', error);
        })
        .updateSpreadsheet(item);
    } catch (error) {
      console.error('Error invoking server function:', error);
    }
    return false;
  }

  async function addChildItem(parentItem: RoadmapItem): Promise<void> {
    const newItem: RoadmapItem = {
      id: crypto.randomUUID(),
      parentId: parentItem.id,
      title: 'New Item',
      owner: 'TBD',
      status: 'planned',
      startPi: parentItem.startPi || PIs[0],
      endPi: parentItem.endPi || PIs[1],
    };
    const index = items.findIndex((item) => item.id === parentItem.id);
    items.splice(index + 1, 0, newItem);

    // @ts-ignore
    if (!globalThis.inGAS) {
      console.warn('Not running in GAS environment. Skipping update.');
      return;
    }
    try {
      console.log('Adding new item to spreadsheet:', newItem);
      // @ts-ignore
      await google.script.run
        .withSuccessHandler((response: boolean) => {
          console.log(`Spreadsheet ${response ? 'successfully updated' : 'failed to update'}`);
          return response;
        })
        .withFailureHandler((error: any) => {
          console.error('Error updating spreadsheet:', error);
        })
        .addRoadmapItem(newItem, index + 1);
    } catch (error) {
      console.error('Error invoking server function:', error);
    }
  }

  async function removeItem(itemToRemove: RoadmapItem): Promise<void> {
    const index = items.findIndex((item) => item.id === itemToRemove.id);
    if (index !== -1) {
      items.splice(index, 1);
      // @ts-ignore
      if (!globalThis.inGAS) {
        console.warn('Not running in GAS environment. Skipping update.');
        return;
      }
      try {
        console.log('Removing item to spreadsheet:', index);
        // @ts-ignore
        await google.script.run
          .withSuccessHandler((response: boolean) => {
            console.log(
              `Spreadsheet ${response ? 'successfully updated' : 'failed to update'}`,
            );
            return response;
          })
          .withFailureHandler((error: any) => {
            console.error('Error updating spreadsheet:', error);
          })
          .removeRoadmapItem(index);
      } catch (error) {
        console.error('Error invoking server function:', error);
      }
    }
  }

  function getAllOwners(items: RoadmapItem[]): string[] {
    const ownersSet = new Set<string>();
    items.filter((item) => !!item.owner).forEach((item) => ownersSet.add(item.owner!));
    return Array.from(ownersSet);
  }

  function hasChildren(item: RoadmapItem): boolean {
    return items.some((i) => i.parentId === item.id);
  }

  function computeDurationFromChildren(
    item: RoadmapItem,
  ): { startPi: string; endPi: string } | null {
    const children = items.filter((i) => i.parentId === item.id);
    if (children.length === 0) {
      return null;
    }
    let startIndex = PIs.length - 1;
    let endIndex = 0;
    children.forEach((child) => {
      const childStartIndex = PIs.indexOf(child.startPi);
      const childEndIndex = PIs.indexOf(child.endPi);
      if (childStartIndex !== -1 && childStartIndex < startIndex) {
        startIndex = childStartIndex;
      }
      if (childEndIndex !== -1 && childEndIndex > endIndex) {
        endIndex = childEndIndex;
      }
    });
    return {
      startPi: PIs[startIndex],
      endPi: PIs[endIndex],
    };
  }

  function computeStatusFromChildren(item: RoadmapItem): string {
    const children = items.filter((i) => i.parentId === item.id);
    if (children.length === 0) {
      return 'planned';
    }
    if (children.every((child) => child.status === 'completed')) {
      return 'completed';
    }
    if (
      children.some((child) => child.status === 'in-progress') ||
      (children.some((child) => child.status === 'completed') &&
        children.some((child) => child.status === 'planned'))
    ) {
      return 'in-progress';
    }
    return 'planned';
  }
</script>

<div class="roadmap" style="--num-PIs: {PIs.length};">
  <!-- Header Row -->
  <div class="header" style="grid-row: 1; grid-column: 1;">Title</div>
  <div class="header" style="grid-row: 1; grid-column: 2;">Owner</div>
  <div class="header" style="grid-row: 1; grid-column: 3;">Status</div>
  {#each PIs as quarter, i}
    <div class="header pi" style="grid-row: 1; grid-column: {i + COLUMN_START_INDEX};">
      {quarter}
    </div>
  {/each}
  <!-- Filter Row-->
  <div class="filter title" style="grid-row: 2; grid-column: 1;">
    <input type="text" placeholder="Filter titles..." bind:value={filter.title} />
    <input
      type="button"
      value="X"
      onclick={() => (filter.title = '')}
      disabled={!filter.title}
    />
  </div>
  <div class="filter" style="grid-row: 2; grid-column: 2;">
    <select style="width: 90%;" bind:value={filter.owner}>
      <option value="">All Owners</option>
      {#each owners as owner}
        <option value={owner}>{owner}</option>
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
    <div class="filter" style="grid-row: 2; grid-column: {i + COLUMN_START_INDEX};">
      &nbsp;
    </div>
  {/each}

  <!-- Background cells -->
  {#each filteredItems as item, index}
    {@const level = idLevelMap.get(item.id) ?? 0}
    {@const computedStatus = level <= 1 ? computeStatusFromChildren(item) : item.status}
    {@const computedDuration = level <= 1 ? computeDurationFromChildren(item) : null}
    {@const hasChildren = items.some((i) => i.parentId === item.id)}
    <RoadmapRow
      {item}
      {index}
      {level}
      {computedStatus}
      {computedDuration}
      {hasChildren}
      {PIs}
      {updateSpreadsheet}
      {addChildItem}
      {removeItem}
      {toggleVisibility}
    />
  {/each}
</div>

<style>
  .roadmap {
    display: grid;
    grid-template-columns: 300px 150px 150px repeat(var(--num-PIs), 1fr);
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
    text-align: start;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header.pi {
    background-color: #34495e;
    text-align: center;
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
</style>
