<script lang="ts">
  import type { RoadmapItem } from "../types";

  interface Props {
    items: RoadmapItem[];
  }

  let { items }: Props = $props();
</script>