import { GridsterItem } from 'angular-gridster2';
import { QuestionField } from './question-field.model';

export class Tab {
  showInSummary: boolean = true;

  constructor(
    public title: string = '',
    public type: TabType = TabType.MAIN,
    public id: string = null,
    public questions: AppGridsterItem[] = [], // inside gridsterItem we have custom property "field" that is "question-field.model"
    public navigationStepId: string = null,
    public orderIndex: number = 0
  ) {}
}

export class AppGridsterItem implements GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;
  hasContent?: boolean;
  field: QuestionField;
}

export class EditTabForm {
  name: string;
  navigationStepId?: string;
  showInSummary: boolean = true;
}

export enum TabType {
  MAIN = 'MAIN',
  FINISH = 'FINISH'
}

export const DefaultTabLabels = {
  [TabType.MAIN]: 'Strona 1',
  [TabType.FINISH]: 'Strona końcowa'
};
