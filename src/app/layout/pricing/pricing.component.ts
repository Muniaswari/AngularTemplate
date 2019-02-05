import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from '../../shared/model/customer';

import { CustomerService } from '../../shared/services/customer.service';
import { AuthService } from '../../shared/guard/auth.service';

import { routerTransition } from '../../router.animations';
import { FormValidation } from '../../shared/common/formValidation';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
    animations: [routerTransition()]
})

export class PricingComponent implements OnInit {
    msg: string;
    message;
    form: FormGroup;
    model: any;
    countries: Array<any>[];
    messageClass;
    constructor(private authService: AuthService,
        private formBuilder: FormBuilder,
        private _formValidation: FormValidation,
        private _dataService: CustomerService,
        private router: Router) {
        this.createForm();
        this.LoadDropDown();
    }

    ngOnInit() {
        // this.LoadUsers();
    }

    LoadDropDown(): void {
        this._dataService.findCountry()
            .subscribe(data => {
                this.countries = data;
            },
                error => this.msg = <any>error);
    }

     createForm() {
        this.model = { _id: 0 };
        this.form = this.formBuilder.group({
            _id: [0],
            CompanyName: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])],
            email: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(100),
                this._formValidation.validateEmail
            ])],
            ContactNo: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(20)
            ])],
            Country: ['', Validators.compose([
                Validators.required
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
        }, { validator: this._formValidation.matchingPasswords('password', 'confirm') });
    }

    // Function to submit form
    onSubmit() {
        const user = {
            IsAdmin: true,
            email: this.form.get('email').value, // E-mail input field
            password: this.form.get('password').value, // Password input field,
            CompanyName: this.form.get('CompanyName').value,
            ContactNo: this.form.get('ContactNo').value,
            Country: this.form.get('Country').value,
            CreatedBy: this.form.get('email').value,

        }
        console.log(user);
        // Function from authentication service to register user
        this.authService.registerUser(user).subscribe(data => {
            console.log(data);
            // Resposne from registration attempt
            if (!data.success) {
                this.message = data.message; // Set an error message
            } else {
                this.message = data.message; // Set a success message
                setTimeout(() => {
                    this.router.navigate(['/login']); // Redirect to login view
                }, 2000);
            }
        });

    }

    checkEmail()
    {}
    // LoadUsers(): void {
    //     this._dataService.get()
    //         .subscribe(customers => { this.customers = customers; },
    //         error => this.msg = <any>error);
    // }

    // editUser(id: any) {
    //     this._dataService.getById(id)
    //         .subscribe(customer => { this.model = customer; },
    //         error => this.msg = <any>error);
    // }

    // deleteCustomer(index: any, id: any) {
    //     this._dataService.delete(id)
    //         .subscribe(response => {
    //             console.log(response);
    //             this.customers.splice(index, 1);
    //             alert('Deleted Successfully!');
    //         },
    //         error => this.msg = <any>error);
    // }

 
}
