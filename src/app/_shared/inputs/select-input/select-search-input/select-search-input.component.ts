import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'mc-select-search-input',
  templateUrl: './select-search-input.component.html',
  styleUrls: ['./select-search-input.component.scss']
})
export class SelectSearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'szukaj...';
  @Input() noEntriesFoundLabel = 'Brak wyników';
  @Output() private changeValue = new EventEmitter<string>();
  @ViewChild('searchSelectInput', { read: ElementRef }) searchSelectInput: ElementRef;

  value: any;
  options: QueryList<MatOption>;
  private previousSelectedValues: any[];
  private onDestroy = new Subject<void>();

  constructor(@Inject(MatSelect) public matSelect: MatSelect) {}

  ngOnInit() {
    this.matSelect.openedChange.pipe(takeUntil(this.onDestroy)).subscribe((opened) => {
      if (opened) {
        this.focus();
      } else {
        this.reset();
      }
    });

    this.matSelect.openedChange
      .pipe(take(1))
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.options = this.matSelect.options;
        this.options.changes.pipe(takeUntil(this.onDestroy)).subscribe(() => {
          const keyManager = this.matSelect._keyManager;
          if (keyManager && this.matSelect.panelOpen) {
            setTimeout(() => {
              keyManager.setFirstItemActive();
            });
          }
        });
      });
    this.initMultipleHandling();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.stopPropagation();
    }
  }

  onInputChange(value) {
    this.value = value;
    this.changeValue.emit(this.value);
  }

  public focus() {
    if (!this.searchSelectInput) {
      return;
    }
    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;
    this.searchSelectInput.nativeElement.focus();
    panel.scrollTop = scrollTop;
  }

  public reset() {
    if (!this.searchSelectInput) {
      return;
    }
    this.searchSelectInput.nativeElement.value = '';
    this.value = '';
    this.onInputChange('');
  }

  private initMultipleHandling() {
    this.matSelect.valueChange.pipe(takeUntil(this.onDestroy)).subscribe((values) => {
      if (this.matSelect.multiple) {
        let restoreSelectedValues = false;
        if (
          this.value &&
          this.value.length &&
          this.previousSelectedValues &&
          Array.isArray(this.previousSelectedValues)
        ) {
          if (!values || !Array.isArray(values)) {
            values = [];
          }
          const optionValues = this.matSelect.options.map((option) => option.value);
          this.previousSelectedValues.forEach((previousValue) => {
            if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
              values.push(previousValue);
              restoreSelectedValues = true;
            }
          });
        }
        if (restoreSelectedValues) {
          this.matSelect._onChange(values);
        }
        this.previousSelectedValues = values;
      }
    });
  }
}
