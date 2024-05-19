import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  GridsterConfig,
  GridType,
  GridsterComponent,
  DisplayGrid,
  GridsterComponentInterface
} from 'angular-gridster2';
import { FormVersionState, FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { MoveQuestion } from 'src/app/_shared/models/question-field.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { AppGridsterItem } from 'src/app/_shared/models/tab.model';
import { GRID_ROW_HEIGHT } from 'src/app/_shared/consts';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'grid-of-fields',
  templateUrl: './grid-of-fields.component.html',
  styleUrls: ['./grid-of-fields.component.scss']
})
export class GridOfFieldsComponent implements OnInit, OnDestroy {
  @Input() data: AppGridsterItem[] = [];
  @Input() type: FormVersionTypes;
  @Input() tabs: string[] = [];
  @Input() currentTab: string = '';
  @Input() state: FormVersionState = null;

  @Output() updateChanges: EventEmitter<any> = new EventEmitter();
  @Output() moveField: EventEmitter<MoveQuestion> = new EventEmitter();
  @Output() removeField: EventEmitter<string> = new EventEmitter();

  @ViewChild('gridster') gridster: GridsterComponent;

  gridConfig: GridsterConfig;

  formVersionState = FormVersionState;

  defaultCoulmnsNumber = 3;
  oneRowHeight = GRID_ROW_HEIGHT;
  containerHeight = 0;
  updateChangesDelay = 150;
  changesTimeout = null;

  isDragging: boolean = false;
  isResizing: boolean = false;
  firstGridSizeCallback = true;

  fieldTypes = FieldTypes;

  get rowNumber() {
    return !!this.gridster ? this.gridster.rows : 0;
  }

  private calculateSubject: Subject<boolean> = new Subject();
  private calculateSubscription: Subscription;

  ngOnInit(): void {
    this.initGridConfig();

    this.calculateSubscription = this.calculateSubject.pipe(debounceTime(500)).subscribe(() => {
      this.calculateContainerHeight();
    });
  }

  ngOnDestroy() {
    if (this.calculateSubscription) {
      this.calculateSubscription.unsubscribe();
    }
  }

  removeInput(item: AppGridsterItem) {
    this.removeField.emit(item.field.id);
  }

  onMoveItem(move: MoveQuestion) {
    this.moveField.emit(move);
  }

  calculateContainerHeight() {
    this.containerHeight = this.gridster.rows * this.gridster.curRowHeight + this.gridConfig.margin;
    this.gridConfig.api.resize();
  }

  onGridSizeChanged(_grid: GridsterComponentInterface) {
    if (this.firstGridSizeCallback) {
      this.firstGridSizeCallback = false;
    } else {
      this.onUpdateChanges();
    }
  }

  onFieldChanges(gridsterItem: AppGridsterItem, index) {
    const searchedItem = this.data.find(
      (item) =>
        item.x === gridsterItem.x &&
        item.y === gridsterItem.y &&
        item.cols === gridsterItem.cols &&
        item.rows === gridsterItem.rows
    );

    if (searchedItem) {
      searchedItem.field = gridsterItem.field;
      this.data = JSON.parse(JSON.stringify(this.data));
      setTimeout(() => {
        this.gridConfig.api && this.gridConfig.api.optionsChanged();
        this.onUpdateChanges();
      }, 1000);
    }
  }

  onItemChange(_item) {
    this.onUpdateChanges();
  }

  onUpdateChanges() {
    if (this.firstGridSizeCallback) {
      return;
    }

    if (!this.isDragging && !this.isResizing) {
      if (this.changesTimeout) {
        clearTimeout(this.changesTimeout);
      }
      this.changesTimeout = setTimeout(() => {
        this.updateChanges.emit();
        this.calculateSubject.next(true);
      }, this.updateChangesDelay);
    }
  }

  onStartDrag() {
    this.isDragging = true;
  }

  onStopDrag() {
    this.isDragging = false;
  }

  onResizeStart() {
    this.isResizing = true;
  }

  onResizeStop() {
    this.isResizing = false;
  }

  initGridConfig() {
    this.gridConfig = {
      gridType: GridType.VerticalFixed,
      displayGrid: DisplayGrid.Always,
      fixedRowHeight: this.oneRowHeight,
      maxCols: 3,
      minCols: 3,
      outerMargin: true,
      margin: 5,
      compactType: 'compactUp',
      scrollSensitivity: 9,
      scrollSpeed: 15,
      draggable: {
        enabled: this.state === this.formVersionState.SKETCH,
        start: () => this.onStartDrag(),
        stop: () => this.onStopDrag()
      },
      resizable: {
        enabled: this.state === this.formVersionState.SKETCH,
        start: () => this.onResizeStart(),
        stop: () => this.onResizeStop()
      },
      initCallback: () => {
        this.calculateSubject.next(true);
      },
      gridSizeChangedCallback: (_grid) => {
        this.onGridSizeChanged(_grid);
        this.calculateSubject.next(true);
      },
      itemInitCallback: (_item) => {
        this.calculateSubject.next(true);
      },
      itemChangeCallback: (_item) => {
        this.onItemChange(_item);
        this.calculateSubject.next(true);
      }
    };
  }
}
