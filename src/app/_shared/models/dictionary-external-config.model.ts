export class DictionaryExternalConfig {
  sourceUrl: string;
  labelPropertyName?: string;
  valuePropertyName: string;
  paramPropertyName?: string;
  urlParams?: DictionaryExternalParam[] = [];
  childConfig?: DictionaryExternalConfig;
}

export class DictionaryExternalParam {
  paramName: string;
  dictLevel: number;
}
