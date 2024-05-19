import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

const ONE_MB = 1024 * 1024;
const DEFAULT_MAX_SIZE = 10 * ONE_MB;
const DEFAULT_FILE_LIMIT_LABEL = 'Maksymalna liczba plików: ';
export const DEFAULT_FILE_UPLOAD_LIMIT = 5;
export const BaseExtensions = [
  'svg',
  'png',
  'jpg',
  'jpeg',
  'txt',
  'xml',
  'xlsx',
  'csv',
  'pdf',
  'docx',
  'doc',
  'xls',
  'zip',
  'rar',
  '7z'
];

@Component({
  selector: 'mc-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  @Input() model: any;
  @Input() options: UploadOptions;
  @Input() disabled: boolean = false;
  @Input() set fileLimit(fileLimit: number) {
    this._fileLimit = fileLimit;
  }
  get fileLimit(): number {
    return this._fileLimit;
  }
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputTouched: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _fileLimit: number;
  maxSizePrecision: number;
  uploadOptions: UploadOptions;
  files: Array<any> = [];
  ERRORS_MAP = {
    size: 'Niepoprawny rozmiar',
    extension: 'Niepoprawne rozszerzenie',
    server: 'Błąd podczas dodawania pliku'
  };
  extensionsList;

  ngOnInit(): void {
    this.options.maxSize = this.options.maxSize || DEFAULT_MAX_SIZE;
    this.options.fileLimit = this.options.fileLimit || DEFAULT_FILE_UPLOAD_LIMIT;
    this.options.fileLimitLabel = this.options.fileLimitLabel || DEFAULT_FILE_LIMIT_LABEL;
    this.options.multiple = this.options.multiple !== undefined ? this.options.multiple : false;
    this.maxSizePrecision = this.options.maxSize < ONE_MB || this.options.maxSize % ONE_MB === 0 ? 0 : 1;
    this.uploadOptions = this.options;
    this.extensionsList = this.getExtensions();
  }

  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.uploadOptions.multiple && event.dataTransfer.files.length > 1) {
      this.inputTouched.emit(true);
      return;
    }
    this.uploadFiles(event.dataTransfer.files);
  }

  uploadFiles(event) {
    this.inputTouched.emit(true);
    if (!isNaN(this.fileLimit)) {
      event = Array.prototype.slice.call(event, 0, this.fileLimit);
    }
    for (const data of event) {
      const file: any = { data, progress: 0 };
      this.validateSize(file);
      this.validateExtension(file);
      this.files.push(file);
      if (!file.error) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    this.uploadOptions
      .uploadMethod(formData)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          file.error = 'server';
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.fileUploaded.emit(event.body);
          this.files.splice(this.files.indexOf(file), 1);
        }
      });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  getExtensions(): string {
    const value = this.uploadOptions.acceptedFormats.map((format) => '.' + format).join(', ');
    return value ? value : '*';
  }

  validateSize(file): void {
    if (file.data.size >= this.uploadOptions.maxSize) {
      file.error = 'size';
    }
  }

  validateExtension(file): void {
    // file can be with extension from extensions map, or can be custom extension, then file typ is not checked
    if (
      this.uploadOptions.acceptedFormats?.length &&
      ((EXTENSIONS_MAP[file.data.type] &&
        !this.uploadOptions.acceptedFormats.includes(EXTENSIONS_MAP[file.data.type])) ||
        (!EXTENSIONS_MAP[file.data.type] &&
          this.uploadOptions.acceptedFormats.every((format: string) => BaseExtensions.includes(format))))
    ) {
      file.error = 'extension';
    }
  }
}

const EXTENSIONS_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
  'image/svg+xml': 'svg',
  'text/plain': 'txt',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/zip': 'zip',
  'application/vnd.rar': 'rar',
  'application/x-7z-compressed': '7z'
};

export class UploadOptions {
  label?: string;
  maxSize?: number;
  fileLimit?: number;
  fileLimitLabel?: string;
  multiple?: boolean;
  uploadMethod: (form) => Observable<HttpEvent<any>>;
  acceptedFormats?: Array<string>;
}
