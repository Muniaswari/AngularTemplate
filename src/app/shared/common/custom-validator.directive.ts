import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customValidator]',
    providers: [{
        provide: NG_ASYNC_VALIDATORS,
        useExisting: forwardRef(() => CustomValidatorDirective), multi: true
    }]
})

export class CustomValidatorDirective implements AsyncValidator {

  constructor() { }
  
  validate(c: AbstractControl): Promise<ValidationErrors> {
        // NOTE: This would normally be observable but for
        // some reason I had trouble with observable.map in
        // stackblitz so I reverted to using a promise.
        // setTimeout is intented to imitate server latency.
        return new Promise<ValidationErrors>(resolve => {
        setTimeout(() => {
          if (c.value.includes('bad') === true) {
            resolve({ message : 'is bad' });
          } else {
            resolve(null);
          }
        }, 500);
    });
  }
}