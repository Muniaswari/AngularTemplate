import { FormControl, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive } from '@angular/core';


// function alphaNumericValid(control: FormControl) {
//     const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
//     if (regExp.test(control.value)) {
//         return null;
//     } else {
//         return { 'alphaNumericValid': true } // Return as invalid FormName
//     }
// }


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[alphaNumericValid][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: AlphaNumericValid,
            multi: true
        }
    ]
})
// tslint:disable-next-line:directive-class-suffix
export class AlphaNumericValid implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        if (regExp.test(control.value)) {
            return null;
        } else {
            return { 'alphaNumericValid': true } // Return as invalid FormName
        }
    }
}
