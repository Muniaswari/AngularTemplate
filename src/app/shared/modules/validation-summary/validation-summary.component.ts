import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'validation-summary',
  templateUrl: './validation-summary.component.html',
  styleUrls: ['./validation-summary.component.css']
})
export class ValidationSummaryComponent implements OnInit {
  @Input() form: NgForm;
  errors: string[] = [];

  constructor() { }

  ngOnInit() {
    if (this.form instanceof NgForm === false) {
      throw new Error('You must supply the validation summary with an NgForm.');
    }
    this.form.statusChanges.subscribe(status => {
      this.resetErrorMessages();
      this.generateErrorMessages(this.form.control);
    });
  }

  resetErrorMessages() {
    this.errors.length = 0;
  }

  generateErrorMessages(formGroup: FormGroup) {
    
    Object.keys(formGroup.controls).forEach(controlName => {
      let control = formGroup.controls[controlName];
      let errors = control.errors;
      let errorStatus=false;
      if (errors === null || errors.count === 0) {
        return;
      }
      // Handle the 'required' case
      if (errors.required) {
        errorStatus=true;
        this.errors.push(`${controlName} is required`);
      }

      if (!errorStatus && errors.alphaNumericValid) {
        this.errors.push(`${controlName} is invalid`);
      }

      // Handle 'minlength' case
      if (errors.minlength) {
        this.errors.push(`${controlName} minimum length is ${errors.minlength.requiredLength}.`);
      }
      // Handle custom messages.
      if (errors.message){
        this.errors.push(`${controlName} ${errors.message}`);
      }
    });
  }
}