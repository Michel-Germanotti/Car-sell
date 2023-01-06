import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseInput]'
})
export class UppercaseInputDirective {

  constructor(
    private contol: NgControl
  ) { }

  // on écoute input - événement:any
  @HostListener('input', ['$event']) onInputChange($event: any){
    if(this.contol) {
      // mon champs -> news value -> uppercase
      this.contol.control?.setValue($event.target.value.toUpperCase());
    }
  }
}
