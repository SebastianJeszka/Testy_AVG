import { GraphNode, NodeProcessData } from 'src/app/_shared/models/graph-node.model';
import { AppProcess } from 'src/app/_shared/models/process-of-node.model';
import { FormVersionFull, FormVersionFlow, GraphValidationMessage } from 'src/app/_shared/models/form-version.model';
import { Tab } from 'src/app/_shared/models/tab.model';
import { LinkEdge } from 'src/app/_shared/models/link-edge.model';

export class TabsFlowGraphController {
  constructor(private c: { formVersion: FormVersionFull }) {}

  get nodes(): GraphNode[] {
    return this.c.formVersion.flow.nodes;
  }

  get links(): LinkEdge[] {
    return this.c.formVersion.flow.links;
  }

  public setupGraph() {
    if (this.c.formVersion.flow) {
      this.c.formVersion.flow.nodes = this.c.formVersion.flow.nodes.map((n) => n);
      this.checkTabsChanges();
      this.c.formVersion.flow.links = this.c.formVersion.flow.links.map((l) => l);
    } else if (!this.c.formVersion.flow) {
      this.generateNewFlow();
    }
  }

  public generateNewFlow() {
    this.c.formVersion.flow = new FormVersionFlow();
    this.c.formVersion.flow.nodes = this.c.formVersion.tabs.map((tab: Tab) =>
      this.createNewNode(null, tab.title, false)
    );
  }

  public checkAndUpdateIfNewNodesAppear() {
    this.c.formVersion.tabs.forEach((tab: Tab) => {
      if (!this.c.formVersion.flow.nodes.find((node) => node.label === tab.title)) {
        this.c.formVersion.flow.nodes.push(this.createNewNode(tab.id, tab.title, false));
      }
    });
  }

  private checkTabsChanges() {
    const nodes = this.c.formVersion.flow.nodes;
    this.c.formVersion.tabs.forEach((tab: Tab, i) => {
      const node = nodes[nodes.findIndex((node) => node.id === tab.id)];
      if (node && node.label !== tab.title) {
        node.label = tab.title;
      }
    });
  }

  public createNewNode(
    id,
    label,
    isCopy: boolean,
    processes: NodeProcessData = new NodeProcessData(),
    hiddenFields: string[] = []
  ): GraphNode {
    return {
      id,
      label,
      data: {
        processes: {
          beforeProcess: processes?.beforeProcess?.forCopies ? processes.beforeProcess : new AppProcess(),
          afterProcess: processes?.afterProcess?.forCopies ? processes.afterProcess : new AppProcess()
        },
        isCopy
      },
      hiddenFields
    };
  }

  checkIfEveryNodeConnectedWithLinks() {
    return this.c.formVersion.flow.nodes.every((node: GraphNode) =>
      this.c.formVersion.flow.links.some((link: LinkEdge) => link.source === node.id || link.target === node.id)
    );
  }

  checkIfNoLinksAdded() {
    return this.c.formVersion.flow.links.length === 0 && this.c.formVersion.flow.nodes.length > 1;
  }

  getPagesThatStartGraph(): GraphNode[] {
    return this.c.formVersion.flow.nodes.filter((node: GraphNode) => {
      if (this.c.formVersion.flow.links.some((link: LinkEdge) => link.source === node.id)) {
        return !this.c.formVersion.flow.links.some((link: LinkEdge) => link.target === node.id);
      }
    });
  }

  getPagesThatEndGraph(): GraphNode[] {
    return this.c.formVersion.flow.nodes.filter((node: GraphNode) => {
      if (this.c.formVersion.flow.links.some((link: LinkEdge) => link.target === node.id)) {
        return !this.c.formVersion.flow.links.some((link: LinkEdge) => link.source === node.id);
      }
    });
  }

  validateGraphAndGetErrorMessage(): GraphValidationMessage | null {
    if(this.c.formVersion.tabs.length === 1){
      return null;
    }

    if (this.checkIfNoLinksAdded()) {
      return GraphValidationMessage.NO_LINKS_ADDED;
    } else if (!this.checkIfEveryNodeConnectedWithLinks()) {
      return GraphValidationMessage.NOT_EVERY_NODE_CONNECTED_WITTH_LINKS;
    } else if (this.getPagesThatStartGraph().length === 1 && this.getPagesThatStartGraph()[0].data.isCopy) {
      return GraphValidationMessage.START_PAGE_CANNOT_BE_COPY;
    } else if (this.getPagesThatStartGraph().length > 1) {
      return GraphValidationMessage.ONLY_ONE_START_PAGE_SHOULD_EXIST;
    } else if (this.getPagesThatEndGraph().length < 1) {
      return GraphValidationMessage.AT_LEAST_ONE_END_PAGE_SHOULD_EXIST;
    }
    
    return null;
  }

  addCopyOfNode(originalNode: GraphNode) {
    if (originalNode) {
      const newCopyIndex = this.generateNewCopyIndex(originalNode);
      const newId = `${originalNode.id}_${newCopyIndex}`;
      const newName = `${originalNode.label}_${newCopyIndex}`;
      const copyOfNode = this.createNewNode(
        newId,
        newName,
        true,
        originalNode.data?.processes,
        originalNode?.hiddenFields
      );
      this.nodes.push(copyOfNode);
      return copyOfNode;
    }
    return;
  }

  generateNewCopyIndex(originalNode: GraphNode) {
    const copiesIndexes = this.nodes
      .filter((node: GraphNode) => node.id.includes(originalNode.id) && node.id.includes('_'))
      .map((node) => Number(node.id.slice(node.id.indexOf('_') + 1)));

    if (copiesIndexes?.length) {
      let indexOfLastCopy: number = copiesIndexes.reduce((prevNumber: number, currentNumber: number) =>
        currentNumber > prevNumber ? currentNumber : prevNumber
      );
      return indexOfLastCopy + 1;
    }
    return 1;
  }

  removeNode(inputNode: GraphNode): void {
    this.nodes.splice(
      this.nodes.findIndex((_node: GraphNode) => _node.id === inputNode.id),
      1
    );
  }

  removeLink(inputLink: LinkEdge): void {
    this.links.splice(
      this.links.findIndex((_link: LinkEdge) => _link.id === inputLink.id),
      1
    );
  }
}

export const getOriginalTabIdFromNode = (node: GraphNode) => {
  return node.id.indexOf('_') > -1 ? node.id.slice(0, node.id.indexOf('_')) : node.id;
};
