export class RegistrationFormPo {
  getRegistrationConfirmationType(label: string) {
    return cy.get('mc-input-radio[name="registerConfirmationType"]').contains(label);
  }
}
