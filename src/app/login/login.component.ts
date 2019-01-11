import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../shared/guard/auth.service';
import { routerTransition } from '../router.animations';
import { Constants } from '../shared/constants';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent {
    messageClass;
    message;
    processing = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private constants: Constants
    ) {
        this.createForm(); // Create Login Form when component is constructed
    }

    // Function to create login form
    createForm() {
        this.form = this.formBuilder.group({
            email: ['nick@nick.com', Validators.compose([Validators.required])],// Field is required  
            CompanyName: [''],
            password: ['Nick@1980', Validators.required] // Password field
        });
    }

    // Function to disable form
    disableForm() {
        this.form.controls['email'].disable(); // Disable email field
        this.form.controls['password'].disable(); // Disable password field
        this.form.controls['CompanyName'].disable();
    }

    // Function to enable form
    enableForm() {
        this.form.controls['email'].enable(); // Enable email field
        this.form.controls['password'].enable(); // Enable password field
        this.form.controls['CompanyName'].enable();
    }

    // Functiont to submit form and login user
    onLoginSubmit() {
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        const user = {
            email: this.form.get('email').value, // email input field
            password: this.form.get('password').value, // Password input field
            CompanyName: this.form.get('CompanyName').value
        }
        // Function to send login data to API
        this.authService.loginwithUser(user).subscribe(data => {
            // Check if response was a success or error
            if (!data.success) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = data.message; // Set error message
                this.processing = false; // Enable submit button
                this.enableForm(); // Enable form for editting
            } else {
                localStorage.setItem('key-basedata', data.user.CompanyName);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('CurLoggedUser', user.email);
                localStorage.setItem('token', data.token);
                this.messageClass = 'alert alert-success'; // Set bootstrap success class
                this.message = data.message; // Set success message
                // Function to store user's token in client local storage
                //  this.authService.storeUserData(data.token, data.user);
                // After 2 seconds, redirect to dashboard page
                //  setTimeout(() => {
                this.router.navigate(['/dashboard']);
                //   this.router.navigate(['/admin',user]);
            }
        });
    }
}
