import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';


function alphaNumericValid(control: FormControl) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(control.value)) {
        return null;
    } else {
        return { 'alphaNumericValid': true } // Return as invalid FormName
    }
}


@Directive({
    selector: '[alphaNumericValid][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useValue: alphaNumericValid,
            multi: true
        }
    ]
})
export class AlphaNumericValid {
}
