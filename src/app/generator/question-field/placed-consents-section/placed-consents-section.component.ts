import { Component, Input } from '@angular/core';
import { Consent, ConsentSectionConfig, QuestionField } from 'src/app/_shared/models/question-field.model';

@Component({
  selector: 'placed-consents-section',
  templateUrl: './placed-consents-section.component.html',
  styleUrls: ['./placed-consents-section.component.scss']
})
export class PlacedConsentsSectionComponent {
  @Input() field: QuestionField;

  constructor() {}

  get consentsList(): Consent[] {
    return this.field.consentSectionConfig?.consents;
  }

  get consentsConfig(): ConsentSectionConfig {
    return this.field.consentSectionConfig;
  }
}
