import { Component, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DEFAULT_FILE_UPLOAD_LIMIT, UploadOptions } from '../../components/file-uploader/file-uploader.component';
import { FileUploadResponse } from '../../models/file-response.model';
import { SnackbarService } from '../../services/snackbar.service';
import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-files',
  templateUrl: './input-files.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: InputFilesComponent, multi: true }],
  styleUrls: ['./input-files.component.scss']
})
export class InputFilesComponent extends ElementBase<Array<any>> implements OnInit {
  @Input() name: string;
  @Input() options: UploadOptions;
  @Input() showCopyLinkBtn: boolean = false;
  @Input() disabled: boolean = false;
  @ViewChild(NgModel) model: NgModel;
  fileLimit: number;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    private snackbar: SnackbarService // only for current project
  ) {
    super(validators, asyncValidators);
  }

  ngOnInit(): void {
    setTimeout(() => this.calculateLeftFiles(), 0);
  }

  calculateLeftFiles() {
    this.fileLimit = (this.options.fileLimit || DEFAULT_FILE_UPLOAD_LIMIT) - (this.value ? this.value.length : 0);
  }

  addFile(file) {
    this.value = this.value ? [...this.value, file] : [file];
    this.model.control.markAsTouched();
    this.calculateLeftFiles();
  }

  removeFile(file: any) {
    this.value = this.value.filter((item) => item !== file);
    this.model.control.markAsTouched();
    this.calculateLeftFiles();
  }

  onClickCopyLink(file: FileUploadResponse) {
    const urlToFile = file.url;
    if (typeof navigator.clipboard == 'undefined') {
      var textArea = document.createElement('textarea');
      textArea.value = urlToFile;
      textArea.style.position = 'fixed'; //avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.warn(msg);
        if (successful) this.snackbar.open('Skopiowano!', 'OK', 1200);
      } catch (err) {
        console.warn('Was not possible to copy te text: ', err);
      }

      document.body.removeChild(textArea);
      return;
    } else {
      navigator.clipboard.writeText(urlToFile).then(
        () => this.snackbar.open('Skopiowano!', 'OK', 1200),
        (err) => {
          console.error(err);
          this.snackbar.open('Nie skopiowano! Wystąpił błąd', 'OK', 1200);
        }
      );
    }
  }
}
