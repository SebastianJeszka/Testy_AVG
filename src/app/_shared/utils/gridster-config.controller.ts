import { DisplayGrid, GridsterComponent, GridsterConfig, GridType } from 'angular-gridster2';

export interface IGridsterComponent {
  gridster: GridsterComponent;
  oneRowHeight: number;
  containerHeight: number;
  gridConfig: GridsterConfig;

  rowNumber: number;
  colsNumber: number;
}

export class GridsterConfigController {
  changesTimeout: number = null;
  updateChangesDelay: number = 15;
  isDragging: boolean = false;
  isResizing: boolean = false;
  firstGridSizeCallback: boolean = true;
  defaultRowHeight: number = 200;

  constructor(public c: IGridsterComponent) {}

  calculateContainerHeight() {
    setTimeout(() => {
      this.c.containerHeight = this.c.rowNumber * this.c.oneRowHeight;
    });
    setTimeout(() => (this.c.gridConfig.api?.resize ? this.c.gridConfig.api.resize() : null));
  }

  onGridSizeChanged(_grid) {
    if (this.firstGridSizeCallback) {
      this.firstGridSizeCallback = false;
    } else {
      this.onUpdateChanges();
    }
  }

  onUpdateChanges() {
    if (!this.isDragging && !this.isResizing) {
      if (this.changesTimeout) {
        clearTimeout(this.changesTimeout);
      }
      this.changesTimeout = window.setTimeout(() => {
        setTimeout(() => this.calculateContainerHeight(), 20);
      }, this.updateChangesDelay);
    }
  }

  onItemChange(_item) {
    this.onUpdateChanges();
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

  // default config
  getConfig(): GridsterConfig {
    return {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      maxCols: 3,
      minCols: 1,
      outerMargin: true,
      margin: 7,
      scrollSensitivity: 9,
      scrollSpeed: 15,
      compactType: 'compactUp',
      fixedRowHeight: this.defaultRowHeight,
      draggable: {
        enabled: true,
        start: () => this.onStartDrag(),
        stop: () => this.onStopDrag()
      },
      resizable: {
        enabled: true,
        start: () => this.onResizeStart(),
        stop: () => this.onResizeStop()
      },

      gridSizeChangedCallback: (_grid) => this.onGridSizeChanged(_grid),
      itemChangeCallback: (_item) => this.onItemChange(_item)
    };
  }
}
