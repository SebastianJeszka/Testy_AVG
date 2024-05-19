import { RegistrationConfirmationType } from './form-version.model';

export enum RegistrationFormUserState {
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class RegistrationFormUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  pesel: string;
  confirmationType: RegistrationConfirmationType;
  state: RegistrationFormUserState;
  serviceFormId: string;
  registerFormId: string;
}
