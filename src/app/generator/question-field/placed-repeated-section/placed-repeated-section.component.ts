import { Component, Input, OnInit } from '@angular/core';
import { GRID_ROW_HEIGHT } from 'src/app/_shared/consts';
import { QuestionField } from 'src/app/_shared/models/question-field.model';
import { AppGridsterItem } from 'src/app/_shared/models/tab.model';
import { countColsForRepeatingSection } from 'src/app/_shared/utils/generator-utilits';

@Component({
  selector: 'repeated-section',
  templateUrl: './placed-repeated-section.component.html'
})
export class PlacedRepeatedSectionComponent implements OnInit {
  @Input() sectionData: QuestionField = null;

  oneRowHeight = GRID_ROW_HEIGHT;
  containerHeight = this.oneRowHeight;

  gridStyle = {
    display: 'grid',
    gap: '1rem',
    'grid-template-columns': null
  };

  ngOnInit(): void {
    const cols = countColsForRepeatingSection(this.sectionData);
    this.gridStyle['grid-template-columns'] = `repeat(${cols}, minmax(0, ${100 / cols}%))`;
  }

  get items(): AppGridsterItem[] {
    return this.sectionData.repeatingSectionGrid;
  }
}
