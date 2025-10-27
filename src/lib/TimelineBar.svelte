
<script lang="ts">
  import { type RoadmapItem } from "../types";
  import { ROW_START_INDEX, COLUMN_START_INDEX, PIs} from "./Roadmap.svelte";

  let {startPi = $bindable(), endPi = $bindable(), status, index } = $props();

// Function to get grid column span for a timeline bar
  function getColumnSpan(startPi: string, endPi: string): { start: number; end: number } {
    const startIndex = PIs.indexOf(startPi);
    const endIndex = PIs.indexOf(endPi);

    return {
      start: startIndex >= 0 ? startIndex + COLUMN_START_INDEX : COLUMN_START_INDEX, // +3 to account for title, owner columns
      end: endIndex >= 0 ? endIndex + COLUMN_START_INDEX + 1 : COLUMN_START_INDEX + PIs.length // +4 to span to end of that column
    };
  }

// Drag state
  let draggedItem = $state<number | null>(null);
  let dragStartX = $state(0);
  let initialStartPiIndex = $state(0);
  let initialEndPiIndex = $state(0);

  function startDrag(e: MouseEvent, index: number) {
    if (e.button !== 0) return; // Only left click

    draggedItem = index;
    dragStartX = e.clientX;
    initialStartPiIndex = PIs.indexOf(startPi);
    initialEndPiIndex = PIs.indexOf(endPi);

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);

    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrag(e: MouseEvent) {
    if (!draggedItem) return;

    const deltaX = e.clientX - dragStartX;
    const gridElement = document.querySelector('.roadmap') as HTMLElement;
    if (!gridElement) return;

    // Get the actual PI column width
    const piCells = gridElement.querySelectorAll('.header.pi');
    if (piCells.length === 0) return;

    const columnWidth = (piCells[0] as HTMLElement).offsetWidth;
    const columnsShifted = Math.round(deltaX / columnWidth);

    if (columnsShifted === 0) return;

    const duration = initialEndPiIndex - initialStartPiIndex;
    const newStartIdx = Math.max(0, Math.min(PIs.length - duration - 1, initialStartPiIndex + columnsShifted));
    const newEndIdx = newStartIdx + duration;

    // Update the item's PIs
    if (startPi !== PIs[newStartIdx] || endPi !== PIs[newEndIdx]) {
      startPi = PIs[newStartIdx];
      endPi = PIs[newEndIdx];
    }
  }

  function stopDrag() {
    draggedItem = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

</script>

<div class="timeline-bar status-{status}"
  class:dragging={draggedItem === index}
  role="button"
  tabindex="0"
  onmousedown={(e) => startDrag(e, index)}
  style="grid-row: {index+ROW_START_INDEX}; grid-column: {getColumnSpan(startPi, endPi).start} / {getColumnSpan(startPi, endPi).end};">
  <div class="timeline-label">
    {startPi} → {endPi}
  </div>
</div>

<style>

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
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    z-index: 10;
    margin: 2px;
    user-select: none;
    cursor: grab;
  }

  .timeline-bar.dragging {
    cursor: grabbing;
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
</style>