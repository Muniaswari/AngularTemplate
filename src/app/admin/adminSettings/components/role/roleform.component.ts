import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../../../shared/services/role.service';
import { Constants } from '../../../../shared/constants';
import { routerTransition } from '../../../../router.animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-roleform',
    templateUrl: './roleform.component.html',
    styleUrls: ['./roleform.component.scss'],
    animations: [routerTransition()]
})

export class RoleFormComponent {

    model = {
        _id: 0,
        rolename: '',
        roleparentid: 0,
        decription: '',
        CreatedBy: '',
        ModifiedBy: '',
        Modified: []
    };

    forminvalid = false;
    messageClass;
    message;
    maxId = 0;
    list: any;
    roles: Array<any>[];

    constructor(private route: ActivatedRoute,
        public constants: Constants,
        private _dataService: RoleService) {
        const id = this.route.snapshot.paramMap.get('_id');
        if (id !== undefined && id !== null) {
            this.model._id = Number(id);
        }
        this.LoadDropDown();
    }

    selectName() {
    }

    // FindMaxId() {
    //     return this._dataService.findMaxId()
    //         .subscribe(maxdata => {
    //             this.maxId = maxdata[0]._id
    //         },
    //             error => this.msg = <any>error);
    // }

    LoadDropDown(): void {
        this._dataService.FindallRoles(this.model._id)
            .subscribe(data => {
                console.log(data);
                if (data.maxIdData !== undefined && data.maxIdData !== null && data.maxIdData.length > 0) {
                    this.maxId = data.maxIdData[0]._id
                }
                this.roles = data.roles;
                if (data.role !== undefined && data.role !== null) {
                    const forminfo = data.role;
                    this.model.rolename = forminfo.rolename;
                    this.model.roleparentid = forminfo.roleparentid;
                    this.model.decription = forminfo.decription;
                    this.model.Modified = forminfo.Modified !== undefined &&
                        forminfo.Modified.length > 0 &&
                        forminfo.Modified !== null ? forminfo.Modified : [];
                }
            }, error => this.message = <any>error);
    }

    save() {
        const forminfo = this.model;
        console.log(this.model);
        //   this.model.rolename = forminfo.rolename;
        //  this.model.roleparentid = forminfo.roleparentid;
        //   this.model.decription = forminfo.decription;
        this.model.CreatedBy = localStorage.getItem('CurLoggedUser');
        if (this.model._id > 0) {
            this.model.ModifiedBy = localStorage.getItem('CurLoggedUser');
            console.log(this.model)
            this._dataService.update(forminfo._id, this.model)
                .subscribe(data => { this.saveResponse(data) });
        } else {
            this.model._id = this.maxId + 1;
            this._dataService.save(this.model)
                .subscribe(data => { this.saveResponse(data) });
        }
    }

    private saveResponse(data: any) {
        if (data.success) {
            this.clearForm();
        }
        alert(data.message);
    }

    private clearForm() {
        //  this.model._id = 0;
        this.model.rolename = '';
        this.model.roleparentid = 0;
        this.model.decription = '';
        this.LoadDropDown();
    }
}
