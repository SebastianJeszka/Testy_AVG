import { Node } from '@swimlane/ngx-graph';
import { SMALL_POPUP_WIDTH } from 'src/app/_shared/consts';
import { LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { SUMMARY_STEP_ID } from 'src/app/_shared/models/stepper.model';
import { EditTabForm, Tab, TabType } from 'src/app/_shared/models/tab.model';
import { getTemporaryId } from 'src/app/_shared/utils/unique-id.utilits';
import { EditTabPopupComponent } from './edit-tab-popup/edit-tab-popup.component';
import { GeneratorComponent } from './generator.component';

export class TabsController {
  constructor(public c: GeneratorComponent) {}

  onAddTab(newTabName: string) {
    this.c.newTabName = newTabName;

    if (this.c.newTabName.length < 2) {
      this.c.snackBar.open('Wpisz co najmniej 2 znaki w nazwie strony', 'OK');
      return;
    }

    if (this.c.newTabName) {
      if (this.c.formService.checkIfTabNameExist(this.c.newTabName)) {
        this.c.snackBar.open('Taka nazwa już istnieje', 'OK');
        return;
      }

      const finishTab = this.c.formVersion.tabs.reduce(function (prev, current) {
        if (+current.orderIndex > +prev.orderIndex) {
          return current;
        } else {
          return prev;
        }
      });

      let indexForNewTab;

      if (finishTab && finishTab.type === TabType.FINISH) {
        indexForNewTab = this.c.formVersion.tabs.length - 1;
      } else {
        indexForNewTab = this.c.formVersion.tabs.length;
      }

      this.c.formVersion.tabs.splice(
        indexForNewTab,
        0,
        new Tab(this.c.newTabName, TabType.MAIN, getTemporaryId(this.c.formVersion), [], null, indexForNewTab)
      );
      if (finishTab && finishTab.type === TabType.FINISH) {
        finishTab.orderIndex = this.c.formVersion.tabs.length - 1;
      }
      this.c.tabsNames = this.c.formVersion.tabs.map((q) => q.title);
      this.c.newTabName = null;
      this.c.updateIsEditedFlag();
    }
    this.c.graphController.checkAndUpdateIfNewNodesAppear();
    this.c.setGraphValidationMessage();
  }

  onRemoveTab(_index?: number) {
    const index =
      _index || this.c.tabWithActiveSettings
        ? this.c.formVersion.tabs.findIndex((tab) => this.c.tabWithActiveSettings.title === tab.title)
        : null;
    if (this.c.formVersion.tabs.length === 1) {
      this.c.snackBar.open('Nie można usunąć jedynej strony formularza', 'OK');
      return;
    }
    if (index === undefined || index === null) {
      this.c.snackBar.open('Nieznany index strony', 'OK');
      return;
    }
    if (this.checkIfTabOrCopiesConnectedInGraph(this.c.formVersion.tabs[index])) {
      this.c.snackBar.open(
        'Przed usunięciem sprawdź czy strona i jej kopie nie mają żadnych polączeń na grafie przepływu stron',
        'OK'
      );
      return;
    }

    this.removeTabAndCopies(index);
    this.refreshOrderIndex();
    this.c.updateIsEditedFlag();
    this.c.setGraphValidationMessage();
  }

  checkIfTabOrCopiesConnectedInGraph(tab: Tab) {
    if (this.c.formVersion.flow) {
      let tabNodes = this.c.formVersion.flow.nodes.filter((node: Node) => node.id.includes(tab.id));
      if (tabNodes && tabNodes.length > 0) {
        return tabNodes.some(
          (tabNode) =>
            this.c.formVersion.flow.links.filter(
              (link: LinkEdge) => link.source === tabNode.id || link.target === tabNode.id
            ).length > 0
        );
      }
      return false;
    }
    return false;
  }

  removeTabAndCopies(index: number) {
    if (index !== undefined && index !== null && index > -1) {
      if (this.c.formVersion.flow) {
        const tab = this.c.formVersion.tabs[index];
        this.c.formVersion.flow.nodes = this.c.formVersion.flow?.nodes.filter((node) => !node.id.includes(tab.id));
      }
      this.c.formVersion.tabs.splice(index, 1);
      this.c.tabsNames = this.c.formVersion.tabs.map((q) => q.title);
    }
  }

  onTabSettingsOpened(tab: Tab) {
    this.c.tabWithActiveSettings = tab;
  }

  editTab(): void {
    if (this.c.tabWithActiveSettings) {
      const sortedNavigationSteps = this.c.formVersion.navigationSteps.sort((a, b) => a.orderIndex - b.orderIndex);
      const dialogRef = this.c.dialog.open(EditTabPopupComponent, {
        width: SMALL_POPUP_WIDTH,
        data: {
          tab: this.c.tabWithActiveSettings,
          steps: sortedNavigationSteps.filter((step) => step.id !== SUMMARY_STEP_ID),
          enableNavigation: this.c.formVersion.enableNavigation
        }
      });

      dialogRef.afterClosed().subscribe((form: EditTabForm) => {
        if (form) {
          const tab = this.c.formVersion.tabs.find((tab) => tab.title === this.c.tabWithActiveSettings.title);
          if (tab) {
            tab.title = form.name;
            tab.navigationStepId = form.navigationStepId;
            tab.showInSummary = form.showInSummary;
            this.c.updateIsEditedFlag();
          }
        }
      });
    }
  }

  private refreshOrderIndex() {
    this.c.formVersion.tabs
      .sort((a: Tab, b: Tab) => a.orderIndex - b.orderIndex)
      .forEach((tab: Tab, index: number) => {
        tab.orderIndex = index;
      });
  }
}
