import { Constants } from '../../../../shared/constants';
import { FormValidation } from '../../../../shared/common/formValidation';
import { MasterService } from '../../../../shared/services/master.service';
import { routerTransition } from '../../../../router.animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-masterform',
    templateUrl: './masterForm.component.html',
    styleUrls: ['./masterForm.component.scss'],
    animations: [routerTransition()]
})

export class MasterformComponent {
    model = {
        _id: 0,
        FormName: '',
        Description: '',
        RouteUrl: '',
        IsForm: false,
        IsData: false,
        Category: 0,
        CreatedBy: '',
        ModifiedBy: '',
        Modified: []
    };
    IsFormChecked = true;
    forminvalid = false;
    messageClass;
    message;
    maxId = 0;
    list: any;
    // var n = +"1"; // the unary + converts to number
    // var b = !!"2"; // the !! converts truthy to true, and falsy to false
    // var s = ""+3; // the ""+ converts to string via toString()
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        public formValidation: FormValidation,
        private _dataService: MasterService) {
        const id = this.route.snapshot.paramMap.get('_id');
        if (id !== undefined && id !== null) {
            this.model._id = Number(id);
        }
        this.FetchData();
    }

    FetchData() {
        console.log(this.model);
        this._dataService.getById(this.model._id)
            .subscribe(data => {
                console.log(data);
                if (data.maxIdData !== null && data.maxIdData.length > 0) {
                    this.maxId = data.maxIdData[0]._id;
                }
                this.list = data.list;
                if (data.editRow !== null) {
                    const forminfo = data.editRow;
                    this.model.FormName = forminfo.FormName;
                    this.model.Description = forminfo.Description;
                    this.model.RouteUrl = forminfo.RouteUrl;
                    this.model.IsForm = forminfo.IsForm;
                    this.model.IsData = forminfo.IsData;
                    this.model.Category = forminfo.Category;
                    this.model.Modified = forminfo.Modified !== undefined &&
                        forminfo.Modified.length > 0 &&
                         forminfo.Modified !== null ? forminfo.Modified : [];
                }
            }, error => { this.errorResponse(<any>error) });
    }

    private errorResponse(err) {
        this.messageClass = 'alert alert-success';
        this.message = err;
    }

    private save() {
        const forminfo = this.model;
        console.log(this.model);
      //  this.model.FormName = forminfo.FormName;
      //  this.model.Description = forminfo.Description;
        //this.model.RouteUrl = forminfo.RouteUrl;
        this.model.IsForm = forminfo.IsForm;
        this.model.IsData = forminfo.IsData;
     //   this.model.Category = forminfo.Category;
        if (this.model._id > 0) {
            this.model.ModifiedBy = localStorage.getItem('CurLoggedUser');
            this._dataService.update(forminfo._id, this.model)
                .subscribe(data => { this.saveResponse(data); });
        } else {
            this.model.CreatedBy = localStorage.getItem('CurLoggedUser');
            this.model._id = this.maxId + 1;
            this._dataService.save(this.model)
                .subscribe(data => { this.saveResponse(data); });
        }
    }

    private checkDuplication() {
        if (this.model.FormName !== '') {
            this._dataService.checkDuplication(this.model.FormName,
                this.model._id).subscribe(data => {
                    if (!data.success) {
                        this.messageClass = 'alert alert-danger';
                        this.message = data.message;
                        this.forminvalid = true;
                    } else {
                        this.messageClass = '';
                        this.message = '';
                        this.forminvalid = false;
                    }
                });
        }
    }

    private saveResponse(data: any) {
        if (data.success) {
            this.clearForm();
        }
        alert(data.message);
    }

    private showRoute($event) {
        const target: any = $event.currentTarget;
        if (target.checked) {
            this.IsFormChecked = false;
        } else {
            this.IsFormChecked = true;
        }
    }

    private clearForm() {
        this.model._id = 0;
        this.model.FormName = '';
        this.model.Description = '';
        this.model.RouteUrl = '';
        this.model.IsForm = false;
        this.model.IsData = false;
        this.model.Category = 0;
        this.FetchData();
    }
}

