import { Branch } from '../components/tree/branch.model';
import { DictionaryExternalConfig } from './dictionary-external-config.model';

export interface DictionaryLevelData {
  title: string;
  placeholder: string;
}

export class Dictionary {
  id: string;
  name: string;
  description: string;
  createDate: Date;
  editDate: Date;
  children?: Branch[] = [];
  externalConfig?: DictionaryExternalConfig = null;
  dictionaryLevelsData?: DictionaryLevelData[] = [];
  businessUnitId: string;
  quantity: number;
}
