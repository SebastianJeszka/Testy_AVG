import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  DictionaryExternalConfig,
  DictionaryExternalParam
} from 'src/app/_shared/models/dictionary-external-config.model';
import { DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';
import { DictionaryConfigService } from 'src/app/_shared/services/dictionary-config.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';

@Component({
  selector: 'dictionary-config-form',
  templateUrl: './dictionary-config-form.component.html',
  styleUrls: ['./dictionary-config-form.component.scss']
})
export class DictionaryConfigFormComponent implements OnInit, OnDestroy {
  config: DictionaryExternalConfig = new DictionaryExternalConfig();
  externalApiFields: string[] = [];
  additionalApiParams: boolean = false;
  parametrizedUrl: string = '';
  parametrizedUrlChanged: Subject<string> = new Subject<string>();
  parametrizedUrlChangedSubscription: Subscription;

  @Input() dictLevel: number;
  dictionaryLevelData: DictionaryLevelData = { title: '', placeholder: '' };

  @Output() save: EventEmitter<{ config: DictionaryExternalConfig; dictionaryLevelData: DictionaryLevelData }> =
    new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  constructor(private snackbar: SnackbarService, public externalDictionaryService: DictionaryConfigService) {}

  get availableDictLevels() {
    return [...Array(this.dictLevel).keys()].map((dictLevel) => String(dictLevel));
  }

  ngOnInit(): void {
    this.parametrizedUrlChangedSubscription = this.parametrizedUrlChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((parametrizedUrl) => {
        this.parametrizedUrl = parametrizedUrl;
        this.externalApiFields = [];
      });
  }

  onSave() {
    this.save.emit({
      config: this.config,
      dictionaryLevelData: this.dictionaryLevelData
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onGetExternalApiFields() {
    if (!this.additionalApiParams) {
      this.config.sourceUrl = this.parametrizedUrl;
    }
    this.externalDictionaryService.getExternalApiFields(this.config.sourceUrl).subscribe(
      (fields: string[]) => {
        if (!fields || !fields.length) {
          this.snackbar.open(
            `Nie znaleziono pól dla podanego adresu URL do API.
Sprawdź czy adres URL zawiera parametry i czy mają one poprawne wartości.`
          );
        } else {
          this.externalApiFields = fields;
        }
      },
      () => {
        this.snackbar.open('Wystąpił błąd. Sprawdź czy adres URL do API słownika jest poprawny.');
      }
    );
  }

  onParametrizedUrlChanged(url: string) {
    this.parametrizedUrlChanged.next(url);
  }

  addParameter() {
    this.config.urlParams.push(new DictionaryExternalParam());
  }

  removeParameter(index: number) {
    this.config.urlParams.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.parametrizedUrlChangedSubscription.unsubscribe();
  }
}
