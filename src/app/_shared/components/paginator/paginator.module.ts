import { PaginatorComponent } from './paginator.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PaginatorComponent],
  exports: [PaginatorComponent],
  imports: [CommonModule]
})
export class PaginatorModule {}
