import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDataProcessComponent } from './external-data-process.component';

describe('ExternalDataProcessComponent', () => {
  let component: ExternalDataProcessComponent;
  let fixture: ComponentFixture<ExternalDataProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalDataProcessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalDataProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
