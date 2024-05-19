import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';
import { DictionaryConfigService } from 'src/app/_shared/services/dictionary-config.service';
import { DictionaryConfigController } from './dictionary-config.controller';

@Component({
  selector: 'dictionary-config-tree',
  templateUrl: './dictionary-config-tree.component.html',
  styleUrls: ['./dictionary-config-tree.component.scss']
})
export class DictionaryConfigTreeComponent implements OnInit, OnDestroy {
  @Input()
  set config(config: DictionaryExternalConfig) {
    this.externalConfig = config;
    this.dictionaryConfigController.initialize(this.externalConfig);
  }
  @Input() editState = false;
  @Input() addNewDictState = false;
  @Input()
  set levelsData(dictionaryLevelsData: DictionaryLevelData[]) {
    this.dictionaryLevelsData = dictionaryLevelsData;
    this.dictionaryConfigController.initializeLevelsData(this.dictionaryLevelsData);
  }
  @Output() configTreeChanged: EventEmitter<DictionaryExternalConfig> = new EventEmitter();
  @Output() dictionaryLevelsDataChanged: EventEmitter<DictionaryLevelData[]> = new EventEmitter();

  externalConfig: DictionaryExternalConfig;
  dictionaryLevelsData: DictionaryLevelData[];
  rootConfigFormVisible: boolean = false;
  dictionaryConfigController = new DictionaryConfigController(this.dictionaryConfigService);
  dataChangeSubscription: Subscription;
  dictionaryLevelsDataChangeSubscription: Subscription;

  constructor(public dictionaryConfigService: DictionaryConfigService) {}

  ngOnInit() {
    this.dataChangeSubscription = this.dictionaryConfigService.dataChange.subscribe(
      (config: DictionaryExternalConfig) => {
        this.externalConfig = config;
        this.configTreeChanged.emit(config);
      }
    );
    this.dictionaryLevelsDataChangeSubscription = this.dictionaryConfigService.dictionaryLevelsDataChange.subscribe(
      (dictionaryLevelsData: DictionaryLevelData[]) => {
        this.dictionaryLevelsData = dictionaryLevelsData;
        this.dictionaryLevelsDataChanged.emit(dictionaryLevelsData);
      }
    );
  }

  showRootConfigForm() {
    this.rootConfigFormVisible = true;
  }

  cancelRootConfigForm() {
    this.rootConfigFormVisible = false;
  }

  saveRootConfigForm({ config, dictionaryLevelData }) {
    this.rootConfigFormVisible = false;
    this.dictionaryConfigController.saveRootConfig(config);
    this.dictionaryConfigController.addDictionaryLevelData(dictionaryLevelData);
  }

  addChildConfig({ config, dictionaryLevelData }) {
    this.dictionaryConfigController.addChildConfig(config);
    this.dictionaryConfigController.addDictionaryLevelData(dictionaryLevelData);
  }

  removeConfig() {
    this.dictionaryConfigController.removeConfig();
    this.dictionaryConfigController.removeDictionaryLevelData();
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription.unsubscribe();
    this.dictionaryLevelsDataChangeSubscription.unsubscribe();
  }
}
