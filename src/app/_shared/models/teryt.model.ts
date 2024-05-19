import { OptionItem } from './option.model';

export class Teryt {
  items: OptionItemTeryt[];
}

export class OptionItemTeryt extends OptionItem {
  type: string;
  symUl: string;
  name1: string;
  name2: string;
  symbol: string;
}
