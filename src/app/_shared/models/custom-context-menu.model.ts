import { ProcessType } from './process-of-node.model';
export class CustomContextMenuItem<T> {
  label: string;
  emitValue?: T;
  subItems?: CustomContextMenuItem<T>[];
  processType?: ProcessType;
}

export class CustomContextMenuEmitValue<T> {
  model: string;
  value: T;
}
