import { Component, Input, OnInit } from '@angular/core';
import { FormVersionState, FormVersionStateLabels } from 'src/app/_shared/models/form-version.model';

@Component({
  selector: 'app-version-state',
  templateUrl: './version-state.component.html',
  styleUrls: ['./version-state.component.scss']
})
export class VersionStateComponent implements OnInit {
  @Input() state: FormVersionState;

  stateLabel: string;

  ngOnInit(): void {
    this.stateLabel = FormVersionStateLabels[this.state];
  }
}
