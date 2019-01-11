import { Component } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../shared/constants';
import { FormValidation } from '../../../../shared/common/formValidation';
import { MenuService } from '../../../../shared/services/menu.service';
import { AuthService } from '../../../../shared/guard/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tabledesign',
    templateUrl: './tabledesign.component.html',
    styleUrls: ['./tabledesign.component.scss'],
    animations: [routerTransition()]
})
export class TableDesignComponent {

    form: FormGroup;
    model;
    message;
    processing = false;
    nameValid;
    nameMessage;
    closeResult: string;
    msg: String;
    maxId = 0;
    data: any;
    list: any;
    formlist: any;

    constructor(public constants: Constants,
        public formValidation: FormValidation,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private _dataService: MenuService) {

        this.createForm();
        this.LoadDropDown();
    }

    LoadDropDown(): void {
        console.log(this.route.snapshot.paramMap.get('_id'));
        this._dataService.findData(this.route.snapshot.paramMap.get('_id'))
            .subscribe(info => {
                console.log(info);
                if (info !== undefined && info !== null) {
                    this.list = info.menus;
                    this.maxId = info.maxId == null ? 0 : info.maxId._id;
                    this.formlist = info.forms;
                    if (info.editmenu !== undefined && info.editmenu !== null) {
                        this.model = info.editmenu;
                    }
                }
            },
                error => this.msg = <any>error);
    }

    // private FindById( ) {
    //     this.message = '';
    //     this._dataService.getById( this.route.snapshot.paramMap.get('_id'))
    //         .subscribe(data => { this.model = data; }, error => this.msg = <any>error);
    // }

    private deleteMaster(index: any, id: any) {
        // this._dataService.delete(id)
        //     .subscribe(response => {
        //         this.list.splice(index, 1);
        //         alert('Deleted Successfully!');
        //     },
        //         error => this.msg = <any>error);
    }

    private onSubmit() {
        this.processing = true;
        console.log(this.form.get('RouteUrl'));
        this.disableForm();
        this.model.LinkwithForm = this.form.get('LinkwithForm').value;
        this.model.MenuName = this.form.get('MenuName').value;
        this.model.ParentId = this.form.get('ParentId').value;
        this.model.RouteUrl = this.form.get('RouteUrl').value;
        this.model.Order = this.form.get('Order').value;
        this.model.Icon = this.form.get('Icon').value;
        console.log(this.model);
        if (this.model._id > 0) {
            this.model.ModifiedBy = localStorage.getItem('CurLoggedUser');
            this._dataService.update(this.form.get('_id').value, this.model)
                .subscribe(data => { this.saveResponse(data); });
        } else {
            this.model.CreatedBy = localStorage.getItem('CurLoggedUser');
            this.model._id = this.maxId + 1;
            this._dataService.save(this.model)
                .subscribe(data => { this.saveResponse(data); });
        }
    }

    // private FindMaxId() {
    //     return this._dataService.findMaxId()
    //         .subscribe(
    //             maxdata => {
    //                 console.log(maxdata);
    //                 if (maxdata.length > 0) {
    //                     this.maxId = maxdata[0]._id;
    //                 }
    //             }                , error => this.msg = <any>error);
    // }

    private createForm() {
        this.model = { _id: 0 };
        this.form = this.formBuilder.group({
            _id: [0],
            MenuName: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
                this.formValidation.alphaNValid
            ])],
            RouteUrl: [''],
            Icon: [''],
            Order: [0],
            ParentId: [0],
            LinkwithForm: [0]
        });
        this.LoadDropDown();
    }

    private disableForm() {
        this.form.controls['MenuName'].disable();
        this.form.controls['ParentId'].disable();
        this.form.controls['LinkwithForm'].disable();
    }

    private enableForm() {
        this.form.controls['MenuName'].enable(); this.form.controls['LinkwithForm'].enable();
        this.form.controls['ParentId'].enable();
    }

    private clearForm() {
        this.model = {};
        this.nameMessage = '';
        this.form.controls['_id'].setValue(0);
        this.form.controls['RouteUrl'].setValue('');
        this.form.controls['Order'].setValue('');
        this.form.controls['Icon'].setValue('');
        this.form.controls['LinkwithForm'].setValue(0);
        this.form.controls['ParentId'].setValue(0);
        this.form.controls['MenuName'].setValue('');
        this.LoadDropDown();
    }

    private saveResponse(data: any) {
        if (!data.success) {
            this.message = data.message;
            this.processing = false;
        } else {

            this.message = data.message;
            this.LoadDropDown();
        }
        this.enableForm();
        this.clearForm();
    }
}
