import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { Consent, ConsentSectionConfig, QuestionField } from 'src/app/_shared/models/question-field.model';
import { FilesService } from 'src/app/_shared/services/files.service';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { OneConsentComponent } from './one-consent/one-consent.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'add-consents-section',
  templateUrl: './add-consents-section.component.html',
  styleUrls: ['./add-consents-section.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ConsentsSectionComponent implements OnInit {
  @Input() field: QuestionField;
  @Input() isTemplateForm: boolean = false;
  @Output() changeConf: EventEmitter<any> = new EventEmitter();
  consentSectionConfig: ConsentSectionConfig = new ConsentSectionConfig();

  constructor(public dialog: MatDialog, public filesService: FilesService) {}

  get consentsConfig(): ConsentSectionConfig {
    return this.field.consentSectionConfig;
  }

  ngOnInit(): void {
    if (this.field?.consentSectionConfig) {
      this.consentSectionConfig = this.field.consentSectionConfig;
    }
  }

  onAddConsent() {
    const dialogRef = this.dialog.open(OneConsentComponent, {
      width: BIG_POPUP_WIDTH,
      data: null
    });

    dialogRef.afterClosed().subscribe((description: string) => {
      if (description) {
        const consent = new Consent(description, false);
        this.consentSectionConfig.consents.push(consent);
        this.changeConf.emit(this.consentSectionConfig);
      }
    });
  }

  onEdit(consent: Consent) {
    const dialogRef = this.dialog.open(OneConsentComponent, {
      width: BIG_POPUP_WIDTH,
      data: consent || null
    });

    dialogRef.afterClosed().subscribe((description: string) => {
      if (description) {
        consent.description = description;
        this.changeConf.emit(this.consentSectionConfig);
      }
    });
  }

  onRemove(index) {
    this.consentSectionConfig.consents.splice(index, 1);
    this.changeConf.emit(this.consentSectionConfig);
  }

  uploadFile(file: FormData) {
    return this.filesService.uploadConsent(file);
  }

  onChangeTechName() {
    this.field.techName = normalizeString(this.field.techName);
  }
}
