import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';
import { DictionaryConfigService } from 'src/app/_shared/services/dictionary-config.service';

export class DictionaryConfigController {
  constructor(public dictionaryConfigService: DictionaryConfigService) {}

  initialize(config: DictionaryExternalConfig) {
    this.dictionaryConfigService.dataChange.next(config);
  }

  initializeLevelsData(dictionaryLevelsData: DictionaryLevelData[]) {
    this.dictionaryConfigService.dictionaryLevelsDataChange.next(dictionaryLevelsData);
  }

  addChildConfig(childConfig: DictionaryExternalConfig) {
    this.dictionaryConfigService.dataChange.next(this.addNewLeaf(this.dictionaryConfigService.data, childConfig));
  }

  removeConfig() {
    this.dictionaryConfigService.dataChange.next(this.removeLeaf(this.dictionaryConfigService.data));
  }

  saveRootConfig(rootConfig: DictionaryExternalConfig) {
    this.dictionaryConfigService.dataChange.next(rootConfig);
  }

  addDictionaryLevelData(dictionaryLevelData: DictionaryLevelData) {
    this.dictionaryConfigService.dictionaryLevelsDataChange.next(
      this.dictionaryConfigService.dictionaryLevelsData.concat(dictionaryLevelData)
    );
  }

  removeDictionaryLevelData() {
    this.dictionaryConfigService.dictionaryLevelsDataChange.next(
      this.dictionaryConfigService.dictionaryLevelsData.slice(0, -1)
    );
  }

  private addNewLeaf(currentConfig: DictionaryExternalConfig, childConfigToAdd: DictionaryExternalConfig) {
    if (!currentConfig.childConfig) {
      currentConfig.childConfig = childConfigToAdd;
    } else {
      currentConfig.childConfig = this.addNewLeaf(currentConfig.childConfig, childConfigToAdd);
    }

    return currentConfig;
  }

  private removeLeaf(currentConfig: DictionaryExternalConfig) {
    if (!currentConfig.childConfig) {
      currentConfig = null;
    } else {
      currentConfig.childConfig = this.removeLeaf(currentConfig.childConfig);
    }

    return currentConfig;
  }
}
