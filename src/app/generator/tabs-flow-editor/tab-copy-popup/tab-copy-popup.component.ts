import { Component, Inject, OnInit } from '@angular/core';
import { Rule, RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { GraphNode } from 'src/app/_shared/models/graph-node.model';
import { AppRuleSet, LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const getOriginNodeId = (node: GraphNode): string => {
  return node.id.slice(0, node.id.indexOf('_'));
};

@Component({
  selector: 'tab-copy-popup',
  templateUrl: './tab-copy-popup.component.html'
})
export class TabCopyPopupComponent implements OnInit {
  originalNode: GraphNode = null;
  tabOfNode: Tab = null;
  tabsFieldsList: OptionItem[] = [];
  addingCopy: boolean = true;
  editionStateEnabled: boolean = false;

  constructor(
    private formService: FormService,
    public dialogRef: MatDialogRef<TabCopyPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      node: GraphNode;
    },
    private snackbar: SnackbarService
  ) {}

  get hiddenFieldsOfNode(): string[] {
    return this.originalNode.hiddenFields;
  }

  set hiddenFieldsOfNode(val: string[]) {
    this.originalNode.hiddenFields = val;
  }

  ngOnInit(): void {
    if (this.data) {
      this.originalNode = this.data.node ? JSON.parse(JSON.stringify(this.data.node)) : null;
      if (this.originalNode.id.indexOf('_') > -1) {
        this.addingCopy = false;
        this.tabOfNode = this.formService.currentFormVersion.tabs.find(
          (tab) => tab.id === this.data.node.id.slice(0, this.data.node.id.indexOf('_'))
        );
      } else {
        this.tabOfNode = this.formService.currentFormVersion.tabs.find((tab) => tab.id === this.data.node.id);
      }
      if (this.tabOfNode) {
        this.tabsFieldsList = this.tabOfNode.questions.map((q: AppGridsterItem, i) => {
          return {
            id: q.field.id,
            name: q.field.techName,
            checked: this.data.node?.hiddenFields?.includes(q.field.id)
          };
        });
      }
      if (!this.hiddenFieldsOfNode) {
        this.hiddenFieldsOfNode = [];
      }
      this.editionStateEnabled = this.formService.checkIfEditionStateEnabledForForm();
    }
  }

  onChangeHiddenFields(checked, item: OptionItem) {
    if (this.hiddenFieldsOfNode) {
      if (checked && this.hiddenFieldsOfNode?.indexOf(item.id) === -1) {
        this.hiddenFieldsOfNode.push(item.id);
      } else if (!checked && this.hiddenFieldsOfNode?.indexOf(item.id) > -1) {
        this.hiddenFieldsOfNode.splice(this.hiddenFieldsOfNode.indexOf(item.id), 1);
      }
    }
  }

  onSaveChanges() {
    if (this.checkIfCopyCanBeAdded()) {
      this.dialogRef.close({
        action: this.addingCopy ? 'add' : 'edit',
        node: this.originalNode
      });
    }
  }

  onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }

  checkIfCopyCanBeAdded(): boolean {
    if (this.tabOfNode?.questions.length < 2) {
      this.snackbar.open('Żeby zrobić kopie strony, ta strona musi mieć przynajmniej 2 pola', 'OK');
      return false;
    }

    if (this.hiddenFieldsOfNode?.length < 1) {
      this.snackbar.open('Nie wybrano pól do ukrycia', 'OK');
      return false;
    }

    if (this.hiddenFieldsOfNode?.length === this.tabOfNode?.questions.length) {
      this.snackbar.open('Nie mogą być ukryte wszystkie pola na stronie', 'OK');
      return false;
    }

    const existedCopy = this.getSameNodeCopy();
    if (existedCopy && existedCopy.id !== this.originalNode.id) {
      this.snackbar.open(`Taka kopia już istnieje, o nazwie: ${existedCopy.label}`, 'OK');
      return false;
    }

    const hiddenFieldsInQueries = this.getHiddenFieldsUsedInLinksQueriesFromCurrentNode();
    if (hiddenFieldsInQueries?.length) {
      let hiddenFieldsLabels: any = hiddenFieldsInQueries.map(
        (fieldId: string) => this.tabsFieldsList.find((item) => item.id === fieldId).name
      );
      hiddenFieldsLabels = hiddenFieldsLabels?.length > 1 ? hiddenFieldsLabels.join(', ') : hiddenFieldsLabels;
      this.snackbar.open(
        `Niektóre zaznaczone pola (${hiddenFieldsLabels}) są używane w warunkach kroków wychodzących z tej kopii`,
        'OK'
      );
      return false;
    }

    return true;
  }

  getSameNodeCopy(): GraphNode {
    const copiesOfNode = this.formService.currentFormVersion?.flow?.nodes?.filter(
      (node: GraphNode) => node.id.includes(getOriginNodeId(this.originalNode)) && node.id.includes('_')
    );
    if (copiesOfNode?.length) {
      const sameCopy: GraphNode = copiesOfNode.find((nodeCopy: GraphNode) => {
        return (
          this.hiddenFieldsOfNode.every((idField: string) => nodeCopy.hiddenFields.includes(idField)) &&
          this.hiddenFieldsOfNode.length === nodeCopy.hiddenFields.length
        );
      });
      if (sameCopy) {
        return sameCopy;
      }
    }
    return null;
  }

  getHiddenFieldsUsedInLinksQueriesFromCurrentNode() {
    const linksFromCurrentNode = this.formService.currentFormVersion.flow.links.filter((link: LinkEdge) => {
      return link.source === this.originalNode.id;
    });
    let fieldsThatUsedInLinks = [];
    linksFromCurrentNode.forEach((link: LinkEdge) => {
      this.hiddenFieldsOfNode.forEach((fieldId: string) => {
        if (this.checkIfFieldUsedInLinksQueries(link.data.query.queryRulesSet, fieldId)) {
          fieldsThatUsedInLinks.push(fieldId);
        }
      });
    });
    return fieldsThatUsedInLinks;
  }

  checkIfFieldUsedInLinksQueries(linkRulset: AppRuleSet, fieldId: string): boolean {
    if (linkRulset) {
      return linkRulset.rules.some((rule: Rule | RuleSet) => {
        if ((rule as AppRuleSet).condition && (rule as AppRuleSet).rules) {
          return this.checkIfFieldUsedInLinksQueries(rule as AppRuleSet, fieldId);
        } else if ((rule as Rule).field) {
          return (rule as Rule).field === fieldId;
        }
      });
    }
    return;
  }
}

export interface HandleNodeCopyData {
  action: 'cancel' | 'add' | 'edit';
  node: GraphNode;
}
