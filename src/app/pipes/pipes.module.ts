import { FirstCharUppercasePipe } from './first-char-uppercase.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    FirstCharUppercasePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FirstCharUppercasePipe
  ]
})
export class PipesModule { }
