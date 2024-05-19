import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { map, switchMap } from 'rxjs';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { FileUploadData, FileUploadResponse } from 'src/app/_shared/models/file-response.model';
import { FormSettings } from 'src/app/_shared/models/form-settings.model';
import { FormVersionFull, FormVersionState } from 'src/app/_shared/models/form-version.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormSettingsService } from 'src/app/_shared/services/form-settings.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'general-settings',
  templateUrl: './general-form-settings.component.html'
})
export class GeneralFormSettingsComponent implements OnInit {
  @Input() formVersion: FormVersionFull;

  imageChangedEvent: any = '';

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  formVersionState = FormVersionState;

  formSettings: FormSettings = new FormSettings();

  languages: OptionItem[] = [
    { id: 'pl', name: 'polski' },
    { id: 'uk', name: 'ukraiński' }
  ];

  isBackgroundChanged: boolean = false;
  previewBackgroundImage: string = null;

  ckeditorConf: CKEditor4.Config = ckeditorConfig();

  constructor(private formSettingsService: FormSettingsService, private snackBar: SnackbarService) {}

  ngOnInit(): void {
    this.formSettingsService.getSettings(this.formVersion).subscribe((fs: FormSettings) => {
      this.formSettings = fs;
      if (!fs.availability) {
        this.formSettings.availability = {
          availableFrom: null,
          availableTo: null
        };
      }
      if (!fs.support) {
        this.formSettings.support = {
          email: '',
          payloadIncluded: false
        };
      }
      if (fs.backgroundImage) {
        this.previewBackgroundImage = environment.gatewayUrl + '/files/' + fs.backgroundImage;
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.previewBackgroundImage = event.base64;
    this.isBackgroundChanged = true;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {}

  loadImageFailed() {}

  onRemoveBg() {
    this.imageChangedEvent = null;
    this.formSettings.backgroundImage = null;
    this.previewBackgroundImage = null;
  }

  onSave() {
    this.formSettings.formVersionId = this.formVersion.id;
    if (this.isBackgroundChanged && this.previewBackgroundImage) {
      this.onSaveSettingsWithBackground();
    } else {
      this.formSettingsService.setSettings(this.formSettings, this.formVersion).subscribe(() => {
        this.snackBar.open('Zmiany zostały zastosowane', 'OK');
        this.formSettingsService.settingsChanged.next(this.formSettings);
      });
    }
  }

  onSaveSettingsWithBackground() {
    const data = new FileUploadData(
      `background-${new Date().toISOString()}.png`,
      this.previewBackgroundImage.slice(this.previewBackgroundImage.indexOf(',') + 1),
      'image/png'
    );
    this.formSettingsService
      .uploadBackground(data)
      .pipe(
        map((fileResp: FileUploadResponse) => {
          if (fileResp) {
            this.formSettings.backgroundImage = fileResp.businessId;
          }
          return this.formSettings;
        }),
        switchMap((r) => {
          return this.formSettingsService.setSettings(this.formSettings, this.formVersion);
        })
      )
      .subscribe(() => {
        this.snackBar.open('Zmiany zostały zastosowane', 'OK');
        this.formSettingsService.settingsChanged.next(this.formSettings);
        this.isBackgroundChanged = false;
      });
  }

  onRemovaDataEnabledChange() {
    if (this.formSettings.removeData.delay) {
      return;
    }

    this.formSettings.removeData.delay = 1;
  }
}
