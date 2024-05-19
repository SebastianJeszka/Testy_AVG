export class ServiceCharter {
  id: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  lastModifiedBy: string;
  businessUnitId: string;
  rootId: string;
  parentId: string;
  version: string;
  state: string;
  name: string;
  widgets: ServiceCharterWidget[];
  categories: ServiceCharterCategory[];
  form: ServiceCharterForm;
}

export class ServiceCharterWidget {
  id: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  lastModifiedBy: string;
  parentId: string;
  widgetType: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  orderIdx: number;
  header: string;
  html: string;
  href: string;
  newWindow: boolean;
  visibilityId: string;
  buttonEvent: string;
}

export class ServiceCharterCategory {
  id: string;
  parentId: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  lastModifiedBy: string;
  name: string;
  description: string;
}
export class ServiceCharterForm {
  formId: string;
  formName: string;
}
