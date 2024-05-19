import { Node, NodeDimension, NodePosition } from '@swimlane/ngx-graph';
import { AppProcess } from './process-of-node.model';

export class GraphNode implements Node {
  id: string;
  position?: NodePosition;
  dimension?: NodeDimension;
  transform?: string;
  label?: string;
  data?: GraphNodeData;
  meta?: any;
  hiddenFields?: string[] = [];
}

export class GraphNodeData {
  processes: NodeProcessData;
  isCopy: boolean;
}

export class NodeProcessData {
  beforeProcess: AppProcess;
  afterProcess: AppProcess;
  constructor() {
    this.beforeProcess = new AppProcess();
    this.afterProcess = new AppProcess();
  }
}
