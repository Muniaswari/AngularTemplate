import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Constants } from '../../../../shared/constants';
import { routerTransition } from '../../../../router.animations';
import { AuthService } from '../../../../shared/guard/auth.service';
import { RoleService } from '../../../../shared/services/role.service';

@Component({
    selector: 'app-roleform',
    templateUrl: './roleform.component.html',
    styleUrls: ['./roleform.component.scss'],
    animations: [routerTransition()]
})

export class RoleFormComponent {
    form: FormGroup;
    model;
    message;
    messageClass;
    processing = false;
    nameValid;
    nameMessage;
    list: any[];
    roles: Array<any>[];
    msg: String;
    maxId = 0;
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
        public constants: Constants,
        private authService: AuthService,
        private _dataService: RoleService) {
        this.createForm();

        this.model._id = this.route.snapshot.paramMap.get('_id');
        if (this.model._id === 0) { this.FindMaxId(); }
        this.LoadDropDown();
    }

    // private FindById(id) {

    //     return this._dataService.findById(id)
    //         .subscribe(role => {
    //             this.model = role
    //         },
    //             error => this.msg = <any>error);
    // }

    selectName() {
    }

    createForm() {
        this.model = { _id: 0 };
        this.form = this.formBuilder.group({
            // name Input
            _id: [0],
            rolename: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(3), // Minimum length is 3 characters
                Validators.maxLength(100), // Maximum length is 15 characters
                this.validatename // Custom validation
            ])],
            roleparentid: [''],
            decription: [''] // Field is required
        });
    }

    FindMaxId() {
        return this._dataService.findMaxId()
            .subscribe(maxdata => {
                this.maxId = maxdata[0]._id
            },
                error => this.msg = <any>error);
    }

    LoadDropDown(): void {
        this._dataService.FindallRoles(this.model._id)
            .subscribe(data => {
                this.roles = data.roles;
                this.model = data.role === null ? { _id: 0 } : data.role;
            },
                error => this.msg = <any>error);
    }

    onSubmit() {
          this.model.rolename = this.form.get('rolename').value;
        this.model.roleparentid = this.form.get('roleparentid').value;
        this.model.decription = this.form.get('decription').value;
        this.model.CreatedBy = localStorage.getItem('CurLoggedUser');
        if (this.model._id > 0) {
            this.model.ModifiedBy = localStorage.getItem('CurLoggedUser');
            this._dataService.update(this.form.get('_id').value, this.model)
                .subscribe(data => { this.saveResponse(data) });
        } else {
            this.model._id = this.maxId + 1;
            this._dataService.save(this.model)
                .subscribe(data => { this.saveResponse(data) });
        }
    }

    private saveResponse(data: any) {
        if (!data.success) {
            this.message = data.message;
        } else {
            this.message = data.message;
            this.FindMaxId();
        }
        this.clearForm();
    }

    private clearForm() {
        this.model = {};
        this.form.controls['_id'].setValue(0);
        this.form.controls['rolename'].setValue('');
        this.form.controls['roleparentid'].setValue('');
        this.form.controls['decription'].setValue('');
        this.LoadDropDown();
    }

    validatename(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        // Test username against regular expression
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validatename': true } // Return as invalid name
        }
    }

    onClick(event) {
        // const li = this.renderer.createElement('li');
        // const text = this.renderer.createText('Click here to add li');
        // this.renderer.appendChild(li, text);
        // this.renderer.appendChild(event.srcElement.parentNode.querySelector('ul'), li);
    }
}
