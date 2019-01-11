import { Component } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Constants } from '../../../../shared/constants';
import { FormValidation } from '../../../../shared/common/formValidation';
import { MenuService } from '../../../../shared/services/menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-idsettings',
    templateUrl: './IDSettings.component.html',
    styleUrls: ['./IDSettings.component.scss'],
    animations: [routerTransition()]
})
export class IDSettingsComponent {
    model = {
        _id: 0,
        Fist: '',
        Middle: '',
        Last: '',
        FormId: 0,
        CreatedBy: '',
        ModifiedBy: '',
        Modified: []
    };
    message;
    forminvalid = false;
    messageClass;
    msg: String;
    maxId = 0;
    data: any;
    list: any;
    formlist: any;

    constructor(public constants: Constants,
        public formValidation: FormValidation,
        private route: ActivatedRoute,
        private _dataService: MenuService) {
        this.LoadDropDown();
    }


    LoadDropDown(): void {
        this.model._id = this.route.snapshot.paramMap.get('_id') === null ? 0 :
            Number(this.route.snapshot.paramMap.get('_id'));
        this._dataService.findData(this.model._id)
            .subscribe(info => {
                console.log(info);
                if (info !== undefined && info !== null) {
                    this.list = info.menus;
                    this.maxId = info.maxId == null ? 0 : info.maxId._id;
                    this.formlist = info.forms;
                    if (info.editmenu !== undefined && info.editmenu !== null) {
                        const forminfo = info.editmenu;
                        this.model.Fist = forminfo.Fist;
                        this.model.Middle = forminfo.Middle;
                        this.model.Last = forminfo.Last;
                        this.model.FormId = forminfo.FormId;
                        this.model.Modified = forminfo.Modified !== undefined &&
                            forminfo.Modified.length > 0 &&
                            forminfo.Modified !== null ? forminfo.Modified : [];
                    }
                }
            },
                error => this.msg = <any>error);
    } 

    private save() {
        const forminfo = this.model;
        this.model.Fist = forminfo.Fist;
        this.model.Middle = forminfo.Middle;
        this.model.Last = forminfo.Last;
        this.model.FormId = forminfo.FormId;
        console.log(this.model);
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

    private clearForm() {
        this.model._id = 0
        this.model.Fist = '';
        this.model.Middle = '';
        this.model.Last = '';
        this.model.FormId = 0;
        this.LoadDropDown();
    }

    private saveResponse(data: any) {
        if (data.success) {
            this.clearForm();
            this.LoadDropDown();
        }
        alert(data.message);
    }
}
