import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FormValidation {
    constructor() {
    }

    public alphaNumericValid(controls: any) {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'alphaNumericValid': true } // Return as invalid FormName
        }
    }

    public alphaNValid(controls: any) {
        const regExp = new RegExp(/^[a-zA-Z]+$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'alphaNumericValid': true } // Return as invalid FormName
        }
    }


    // Function to validate e-mail is proper format
    public validateEmail(controls) {
        // Create a regular expression
        // tslint:disable-next-line:max-line-length
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid email
        } else {
            return { 'validateEmail': true } // Return as invalid email
        }
    }


    // Function to validate password
    public validatePassword(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/);
        // Test password against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid password
        } else {
            return { 'validatePassword': true } // Return as invalid password
        }
    }

    // Funciton to ensure passwords match
    public matchingPasswords(password, confirm) {
        return (group: FormGroup) => {
            // Check if both fields are the same
            if (group.controls[password].value === group.controls[confirm].value) {
                return null; // Return as a match
            } else {
                return { 'matchingPasswords': true } // Return as error: do not match
            }
        }
    }
}
