export class FormSettings {
  backgroundImage: string = null;
  captchaEnabled: boolean = null;
  formVersionId: string = null;
  successPageInfo: string = null;
  successPageRedirectBtnUrl: string = null;
  successPageRedirectBtnLabel: string = null;
  failPageInfo: string = null;
  failPageRedirectBtnUrl: string = null;
  failPageRedirectBtnLabel: string = null;
  summarySectionEnabled: boolean = null;
  blockedFormInfo: string = null;
  availability?: Availability;
  support?: SupportSettings;
  textLanguage: string = 'pl';
  removeData: RemoveData = new RemoveData();
  ticketMailingList?: string[] = [];
}

export class Availability {
  availableFrom?: Date = null;
  availableTo?: Date = null;
}

export class RemoveData {
  enabled: boolean = false;
  delay: number = null;
}

class SupportSettings {
  email: string = '';
  payloadIncluded: boolean = false;
}
