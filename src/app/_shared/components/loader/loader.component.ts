import { Component, Input } from '@angular/core';

@Component({
  selector: 'mc-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() ariaLabel: string = 'Trwa ładowanie';
  @Input() size: 'small' | undefined;
}
