import { NgControl } from '@angular/forms';
import { Directive, HostListener } from '@angular/core';
import { __values } from 'tslib';

@Directive({
  selector: '[appFirstUppercaseInput]'
})
export class FirstUppercaseInputDirective {

  constructor(
    private contol: NgControl
  ) { }

  // on écoute input - événement:any
  @HostListener('input', ['$event']) onInputChange($event: any){
    if(this.contol) {
      // mon champs -> news value -> uppercase
      const firstLetter = $event.target.value[0].toUpperCase();
      const lastLetter = $event.target.value.slice(1);
      this.contol.control?.setValue(firstLetter+lastLetter);
    }
  }
}
