export interface RoadmapItem {
  id: string;
  title: string;
  owner: string;
  startPi: string;
  endPi: string;
  parentId: string;
  status: '' | 'planned' | 'in-progress' | 'completed';
}