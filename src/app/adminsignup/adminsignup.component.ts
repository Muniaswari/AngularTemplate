import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/guard/auth.service';
import { CommunicationService } from '../shared/services/Communication.service';
import { FormValidation } from '../shared/common/formValidation';

@Component({
    selector: 'app-adminsignup',
    templateUrl: './adminsignup.component.html',
    styleUrls: ['./adminsignup.component.scss'],
    animations: [routerTransition()]
})
export class AdminSignupComponent {
    form: FormGroup;
    message;
    messageClass;
    processing = false;
    emailValid;
    emailMessage;

    constructor(
        private formBuilder: FormBuilder,
        private _formValidation: FormValidation,
        private _communication: CommunicationService,
        private authService: AuthService,
        private router: Router
    ) {
        this.createForm(); // Create Angular 2 Form when component loads
    }

    // Function to create registration form
    createForm() {
        this.form = this.formBuilder.group({
            // Email Input
            email: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(5), // Minimum length is 5 characters
                Validators.maxLength(30), // Maximum length is 30 characters
                this._formValidation.validateEmail // Custom validation
            ])],
            // Password Input
            password: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(6), // Minimum length is 8 characters
                Validators.maxLength(35), // Maximum length is 35 characters
                this._formValidation.validatePassword // Custom validation
            ])],
           
            // Confirm Password Input
            confirm: ['', Validators.required] // Field is required
        }, {
            validator: this._formValidation.matchingPasswords('password',
                'confirm')
            }); // Add custom validator to form for matching passwords
    }

    // Function to disable the registration form
    disableForm() {
        this.form.controls['email'].disable();
        this.form.controls['password'].disable();
        this.form.controls['confirm'].disable();
    }

    // Function to enable the registration form
    enableForm() {
        this.form.controls['email'].enable();
        this.form.controls['password'].enable();
        this.form.controls['confirm'].enable();
    }

    // Function to submit form
    onRegisterSubmit() {
        this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
        this.disableForm(); // Disable the form
        // Create user object form user's inputs
        const user = {
            IsAdmin: true,
            email: this.form.get('email').value, // E-mail input field
            password: this.form.get('password').value // Password input field
        }
        // Function from authentication service to register user
        this.authService.adminregisterUser(user).subscribe(data => {
            // Resposne from registration attempt
            if (!data.success) {
                this.messageClass = 'alert alert-danger'; // Set an error class
                this.message = data.message; // Set an error message
                this.processing = false; // Re-enable submit button
                this.enableForm(); // Re-enable form
            } else {
                this.messageClass = 'alert alert-success'; // Set a success class
                this.message = data.message; // Set a success message
                // After 2 second timeout, navigate to the login page
                
                setTimeout(() => {
                    this.router.navigate(['/login']); // Redirect to login view
                }, 2000);
            }
        });

    }

    // Function to check if e-mail is taken
    checkEmail() {
        // Function from authentication file to check if e-mail is taken
        this.authService.checkEmailAdmin(this.form.get('email').value).subscribe(data => {
            // Check if success true or false was returned from API
            if (!data.success) {
                this.emailValid = false; // Return email as invalid
                this.emailMessage = data.message; // Return error message
            } else {
                this.emailValid = true; // Return email as valid
                this.emailMessage = data.message; // Return success message
            }
        });
    }

    sendMail()
    {
       this. _communication.sendEmail(null);
    }

    sendSms()
    {
        this.    _communication.sendSms(null);

    }
}
