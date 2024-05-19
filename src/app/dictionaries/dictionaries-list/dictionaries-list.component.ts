import { Component, OnInit, ViewChild } from '@angular/core';
import { DictionariesService } from '../../_shared/services/dictionaries.service';
import { Dictionary } from 'src/app/_shared/models/dictionary.model';
import { DictionaryViewComponent } from '../dictionary-view/dictionary-view.component';
import { AddDictionaryComponent } from '../add-dictionary/add-dictionary.component';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { BaseListsComponent } from 'src/app/_shared/utils/base-lists.component';
import {
  SortDirection,
  TableHeader,
  TableHeaderType,
  TableOptions
} from 'src/app/_shared/components/table/table.model';
import { CellClickedEvent } from 'src/app/_shared/components/table/table.component';
import { DictionaryConfigViewComponent } from '../external-api/dictionary-config-view/dictionary-config-view.component';
import { List } from '../../_shared/models/list.model';
import { Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';
@Component({
  selector: 'dictionaries-list',
  templateUrl: './dictionaries-list.component.html',
  styleUrls: ['./dictionaries-list.component.scss']
})
export class DictionariesListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'quantity', 'date'];
  data: Dictionary[] = [];
  globalData: BaseListsComponent<Dictionary>;
  businessUnitData: BaseListsComponent<Dictionary>;

  @ViewChild('currentTab')
  currentTab: MatTabChangeEvent;

  listOptions: TableOptions = {
    showCount: true,
    filter: true,
    filterLabel: 'Znajdź słownik',
    filterPlaceholder: 'Wpisz czego szukasz',
    defaultColumnSorting: 'createDate'
  };

  listHeaders: TableHeader[] = this.getListHeaderConfig();

  globalDictionaryTab: Observable<boolean> = this.rolesService.exceptRole('ALLOW_GLOBAL_DICT');

  constructor(
    private dictionaryService: DictionariesService,
    public dialog: MatDialog,
    private rolesService: NgxIbeRolesService
  ) {
    this.globalData = new BaseListsComponent<Dictionary>();
    this.businessUnitData = new BaseListsComponent<Dictionary>();
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.dictionaryService.getList().subscribe((data: List<Dictionary>) => {
      const items = data.items;
      const global = items.filter((item) => item.businessUnitId === null);
      const businessUnit = items.filter((item) => item.businessUnitId !== null);
      this.globalData.onGetListSuccess(new List<Dictionary>(global.length, global));
      this.businessUnitData.onGetListSuccess(new List<Dictionary>(businessUnit.length, businessUnit));
    });
  }

  onClickRecord(event: CellClickedEvent<Dictionary>) {
    const dialogConfig = {
      width: BIG_POPUP_WIDTH,
      data: event.row
    } as MatDialogConfig;
    let dialogRef: MatDialogRef<DictionaryViewComponent, any> | MatDialogRef<DictionaryConfigViewComponent, any>;
    if (event.row.externalConfig) {
      dialogRef = this.dialog.open(DictionaryConfigViewComponent, dialogConfig);
    } else {
      dialogRef = this.dialog.open(DictionaryViewComponent, dialogConfig);
    }

    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) {
        this.reload();
      }
    });
  }

  onClickAdd() {
    const dialogRef = this.dialog.open(AddDictionaryComponent, {
      width: BIG_POPUP_WIDTH
    });

    dialogRef.afterClosed().subscribe((dictionary) => {
      if (dictionary) {
        this.reload();
      }
    });
  }

  tabChange($event: MatTabChangeEvent) {
    this.currentTab = $event;
  }

  private getListHeaderConfig(): TableHeader[] {
    return [
      {
        name: 'name',
        display: 'Tytuł',
        sortable: true,
        filterable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'description',
        display: 'Opis',
        filterable: true,
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'quantity',
        display: 'Ilość elementów',
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left',
        sortMethod: (a: Dictionary, b: Dictionary, sortDirection: SortDirection) => {
          const aQuantity = a.children.length;
          const bQuantity = b.children.length;
          return sortDirection == 'ASC' ? aQuantity - bQuantity : bQuantity - aQuantity;
        }
      },
      {
        name: 'createDate',
        display: 'Data utworzenia',
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      }
    ];
  }
}
