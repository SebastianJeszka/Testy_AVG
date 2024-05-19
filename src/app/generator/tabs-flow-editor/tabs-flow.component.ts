import { Component, HostListener, OnInit } from '@angular/core';
import { FormService } from 'src/app/_shared/services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormVersionFull, FormVersionState, GraphValidationMessage } from 'src/app/_shared/models/form-version.model';
import { Node } from '@swimlane/ngx-graph';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { EditLinkPopupComponent, EditLinkResult } from './edit-link-popup/edit-link-popup.component';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { getOriginalTabIdFromNode, TabsFlowGraphController } from './tabs-flow-graph.controller';
import { TabsFlowValidator } from './tabs-flow.validator';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { GraphTooltipController } from './graph-tooltip.controller';
import { EditProcessData, ProcessPopupComponent } from '../process-popup/process-popup.component';
import { GraphNode } from 'src/app/_shared/models/graph-node.model';
import { QueryBuilderConfig } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { HandleNodeCopyData, TabCopyPopupComponent } from './tab-copy-popup/tab-copy-popup.component';
import { checkIfIdIsUuidV4 } from 'src/app/_shared/utils/check-if-ID-uuid.utilits';
import { MatDialog } from '@angular/material/dialog';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';

@Component({
  selector: 'tabs-flow',
  templateUrl: './tabs-flow.component.html',
  styleUrls: ['./tabs-flow.component.scss']
})
export class TabsFlowComponent implements OnInit {
  formVersion: FormVersionFull = null;
  isEdited = false;

  currentTabId: string = null;
  tabsOptions: OptionItem[] = [];
  startNodeOptions: OptionItem[] = [];
  finishNodeOptions: OptionItem[] = [];

  newNodeOption: OptionItem = null;

  get nodes(): GraphNode[] {
    return this.formVersion.flow.nodes;
  }

  get links(): LinkEdge[] {
    return this.formVersion.flow.links;
  }

  update$: Subject<boolean> = new Subject();

  previewUrl: string = '';

  currentQueryConfig: QueryBuilderConfig;

  graphController: TabsFlowGraphController = new TabsFlowGraphController(this);
  tabsFlowValidator: TabsFlowValidator = new TabsFlowValidator();
  graphTooltipController: GraphTooltipController = new GraphTooltipController(this);

  defaultStepColor = '#598527';

  formVersionState = FormVersionState;

  graphValidationMessage: GraphValidationMessage = null;

  linksAdded: boolean = false;

  subscription: Subscription;
  currentUserId = '';

  constructor(
    private formService: FormService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackbarService,
    private authService: NgxIbeAuthService
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.isEdited;
  }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((resp) => {
      this.currentUserId = resp.sub;
    });
    this.getData();
  }

  getData() {
    const formId = this.activeRoute.snapshot.params['id'];
    const formVersionId = this.activeRoute.snapshot.queryParams['formVersionId'];
    this.currentTabId = this.activeRoute.snapshot.queryParams['currentTabId'];
    // if (this.formService.currentFormVersion) { // in case current form needs to be cached
    //   this.graphController.setupGraph(this.formService.currentFormVersion);
    // }
    if (formId) {
      this.formService.getFormVersion(formId, formVersionId).subscribe((formVersion: FormVersionFull) => {
        this.formVersion = formVersion;
        this.previewUrl = environment.previewFormUrl + '?formVersionId=' + formVersionId + '&formId=' + formId;
        this.graphController.setupGraph();
        this.linksAdded = !this.graphController.checkIfNoLinksAdded();
        this.initSelectsData();
        this.setGraphValidationMessage();
      });
    }
  }

  goToTab(node: Node) {
    const tabId = getOriginalTabIdFromNode(node);
    this.router.navigate([`/generator/view/${this.formVersion.formId}`], {
      queryParams: { currentTabId: tabId }
    });
  }

  initSelectsData() {
    this.startNodeOptions = [];
    this.finishNodeOptions = [];
    this.nodes.forEach((node: GraphNode) => {
      const optionNode = {
        name: node.label,
        id: node.id
      };
      if (!node.data.isCopy) {
        this.tabsOptions.push(optionNode);
      }
      this.startNodeOptions.push(optionNode);
      this.finishNodeOptions.push(optionNode);
    });
    this.updateAndRefreshLinkOptions();
  }

  updateAndRefreshLinkOptions(option?: OptionItem) {
    if (option) {
      this.startNodeOptions.push(option);
      this.finishNodeOptions.push(option);
    }
    this.startNodeOptions = this.startNodeOptions.map((o) => o).sort((a, b) => this.sortOptionsByName(a, b));
    this.finishNodeOptions = this.finishNodeOptions.map((o) => o).sort((a, b) => this.sortOptionsByName(a, b));
  }

  removeOptionAndRefresh(nodeId) {
    this.startNodeOptions.splice(
      this.startNodeOptions.findIndex((_n) => _n.id === nodeId),
      1
    );
    this.finishNodeOptions.splice(
      this.finishNodeOptions.findIndex((_n) => _n.id === nodeId),
      1
    );
    // refresh values
    this.startNodeOptions = [];
    this.finishNodeOptions = [];
    this.nodes.forEach((node) => {
      this.updateAndRefreshLinkOptions({
        id: node.id,
        name: node.label
      });
    });
  }

  sortOptionsByName(a: OptionItem, b: OptionItem) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  }

  onNewQueryConfig(config: QueryBuilderConfig) {
    this.currentQueryConfig = config;
  }

  onAddNewLink(link: LinkEdge) {
    if (!link) return;
    this.validateLinksQueries(link, false);
    this.links.push(link);
    this.update$.next(true);
    this.setFlowIsEdited();
  }

  onClickInLink(link) {
    const dialogRef = this.dialog.open(EditLinkPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        edge: link,
        startNodeOptions: this.startNodeOptions,
        finishNodeOptions: this.finishNodeOptions,
        formVersion: this.formVersion
      }
    });

    dialogRef.afterClosed().subscribe((field: EditLinkResult) => {
      if (field) {
        if (field.action === 'remove') {
          this.links.splice(
            this.links.findIndex((v) => v.id === field.link.id),
            1
          );
        } else if (field.action === 'edit') {
          this.validateLinksQueries(field.link, true);
          this.links.splice(
            this.links.findIndex((v) => v.id === field.link.id),
            1,
            Object.assign({}, field.link)
          );
        }
        if (field.action !== 'cancel') {
          this.update$.next(true);
          this.setFlowIsEdited();
        }
      }
    });
  }

  validateLinksQueries(link: LinkEdge, isEdtition: boolean) {
    const correctLinks = this.tabsFlowValidator.checkCorrectLinks(this.formVersion, link);
    if (correctLinks.length > 1) {
      this.snackBar.open(
        `Ilość poprawnych przejśc z tej samej strony ${isEdtition ? 'po edycji' : 'po dodaniue nowego'} kroku: ${
          correctLinks.length
        }!
      Nazwy kroków: ${correctLinks.map((l) => (l.data.query ? l.data.query?.queryName : '')).join(', ')}`,
        'Rozumiem',
        10000
      );
      return false;
    }
    if (correctLinks.length === 1) {
      return true;
    }
  }

  onRemoveNode(node: Node) {
    if (this.checkIfNodeConnected(node)) {
      this.snackBar.open('Żeby usunąć element graph`a, wszystkie polączenia z nim muszą być usunięte', 'Rozumiem');
    } else {
      this.graphController.removeNode(node);
      this.removeOptionAndRefresh(node.id);
      this.setFlowIsEdited();
      this.update$.next(true);
    }
  }

  checkIfNodeConnected(node: Node) {
    return this.links.filter((link: LinkEdge) => link.source === node.id || link.target === node.id).length > 0;
  }

  onSetDefault() {
    this.graphController.generateNewFlow();
    this.setFlowIsEdited();
  }

  onSaveFlow() {
    this.formVersion.flow.links = this.links;
    this.removeTemporaryNodeId();
    this.formVersion.flow.nodes = this.nodes;
    this.formService.editFormVersion(this.formVersion).subscribe(() => {
      this.isEdited = false;
      this.setGraphValidationMessage();
      this.linksAdded = !this.graphController.checkIfNoLinksAdded();
    });
  }

  removeTemporaryNodeId() {
    this.nodes.forEach((node: GraphNode) => {
      if (!node.data.isCopy && !checkIfIdIsUuidV4(node.id)) {
        node.id = null;
      }
    });
  }

  setFlowIsEdited() {
    this.isEdited = true;
    this.setGraphValidationMessage();
  }

  setGraphValidationMessage() {
    this.graphValidationMessage = this.graphController.validateGraphAndGetErrorMessage();
  }

  showRemoveOption(item: GraphNode) {
    return item.label.includes('_');
  }

  showHandleCopiesOption(item: GraphNode) {
    return !item.data.isCopy;
  }

  showEditCopyOption(item: GraphNode) {
    return item.data.isCopy;
  }

  onOpenProcessPopup(tabNode: GraphNode) {
    const dialogRef = this.dialog.open(ProcessPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        node: tabNode
      }
    });

    dialogRef.afterClosed().subscribe((nodeFromPopup: EditProcessData) => {
      if (nodeFromPopup?.action === 'edit') {
        tabNode.data.processes = nodeFromPopup.nodeProcess;
        this.setFlowIsEdited();
        this.update$.next(true);
      }
    });
  }

  ifBeforeProcesses(node: Node) {
    return node.data?.processes?.beforeProcess.enabled;
  }

  ifAfterProcesses(node: Node) {
    return node.data?.processes?.afterProcess.enabled;
  }

  onOpenCopiesOfTabPopup(tabNode: GraphNode) {
    const dialogRef = this.dialog.open(TabCopyPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        node: tabNode
      }
    });

    dialogRef.afterClosed().subscribe((nodeCopyData: HandleNodeCopyData) => {
      if (nodeCopyData?.node && nodeCopyData?.action !== 'cancel') {
        if (nodeCopyData.action === 'edit') {
          this.nodes.find((node) => node.id === nodeCopyData.node.id).hiddenFields = nodeCopyData.node.hiddenFields;
        } else if (nodeCopyData.action === 'add') {
          const newNode = this.graphController.addCopyOfNode(nodeCopyData.node);
          this.updateAndRefreshLinkOptions({
            id: newNode.id,
            name: newNode.label
          });
        }
        this.setFlowIsEdited();
        this.update$.next(true);
      }
    });
  }

  getNodeWIdth(node) {
    const minWidth = 140;
    if (this.ifAfterProcesses(node) && this.ifBeforeProcesses(node)) return minWidth + 24 * 2;
    if (this.ifAfterProcesses(node) || this.ifBeforeProcesses(node)) return minWidth + 24;
    return minWidth;
  }

  get isUserForm() {
    return this.currentUserId === this.formVersion.redactorId;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
