import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';


function alphabetValid(control: FormControl) {
    const regExp = new RegExp(/^[a-zA-Z]+$/);
    if (regExp.test(control.value)) {
        return null;
    } else {
        return { 'alphabetValid': true } // Return as invalid FormName
    }
}


@Directive({
    selector: '[alphabetValid][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useValue: alphabetValid,
            multi: true
        }
    ]
})
export class AlphabetValid {
}
