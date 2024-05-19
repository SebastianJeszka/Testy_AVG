export class Branch {
  name: string;
  id: string;
  active: boolean;
  checked: boolean;
  level: number;
  indeterminate: boolean;
  createDate?: string;
  children?: Branch[];
  href?: string;
  childUrl?: string | boolean;
  loading?: boolean;
  _metadata?: any;
}
