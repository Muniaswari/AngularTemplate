import { Component } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Constants } from '../../../../shared/constants';
import { FormValidation } from '../../../../shared/common/formValidation';
import { MenuService } from '../../../../shared/services/menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-menucreate',
    templateUrl: './menucreate.component.html',
    styleUrls: ['./menucreate.component.scss'],
    animations: [routerTransition()]
})
export class MenucreateComponent {
    model = {
        _id: 0,
        MenuName: '',
        RouteUrl: '',
        Icon: '',
        Order: 0,
        ParentId: 0,
        LinkwithForm: 0,
        Category: 0,
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
                        this.model.LinkwithForm = forminfo.LinkwithForm;
                        this.model.MenuName = forminfo.MenuName;
                        this.model.ParentId = forminfo.ParentId;
                        this.model.RouteUrl = forminfo.RouteUrl;
                        this.model.Order = forminfo.Order;
                        this.model.Icon = forminfo.Icon;
                        this.model.Modified = forminfo.Modified !== undefined &&
                            forminfo.Modified.length > 0 &&
                            forminfo.Modified !== null ? forminfo.Modified : [];
                    }
                }
            },
                error => this.msg = <any>error);
    }

     checkDuplication() {
        if (this.model.MenuName !== '') {
            this._dataService.checkDuplication(this.model.MenuName,
                this.model._id).subscribe(data => {
                    console.log(data);
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

     save() {
        const forminfo = this.model;
        this.model.LinkwithForm = forminfo.LinkwithForm;
        this.model.MenuName = forminfo.MenuName;
        this.model.ParentId = forminfo.ParentId;
        this.model.RouteUrl = forminfo.RouteUrl;
        this.model.Order = forminfo.Order;
        this.model.Icon = forminfo.Icon;
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

     clearForm() {
        this.model._id = 0
        this.model.RouteUrl = '';
        this.model.Order = 0;
        this.model.Icon = '';
        this.model.LinkwithForm = 0;
        this.model.ParentId = 0;
        this.model.MenuName = '';
        this.LoadDropDown();
    }

     saveResponse(data: any) {
        if (data.success) {
            this.clearForm();
            this.LoadDropDown();
        }
        alert(data.message);
    }
}
