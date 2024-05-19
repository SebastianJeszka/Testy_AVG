import { FormVersionTypes } from "./form-version.model";

export class OptionItem {
  id: string;
  name: string = '';
  checked?: boolean; // for checkboxes ngModel (when generate form)
  isAnswer?: boolean;
  children?: OptionItem[];
  ifShowInput?: boolean;
  params?: string[];
  tabId?: string;
  tabTitle?: string;
  excluded?: FormVersionTypes[]
  // metadata?: any;
}
