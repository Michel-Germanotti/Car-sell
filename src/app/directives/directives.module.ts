import { UppercaseInputDirective } from './uppercase-input.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstUppercaseInputDirective } from './first-uppercase-input.directive';



@NgModule({
  declarations: [
    UppercaseInputDirective,
    FirstUppercaseInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UppercaseInputDirective,
    FirstUppercaseInputDirective
  ]
})
export class DirectivesModule { }
