import { Component } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { AuthService } from '../../../../shared/guard/auth.service';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-formpermission',
    templateUrl: './formPermission.component.html',
    styleUrls: ['./formPermission.component.scss'],
    animations: [routerTransition()]
})

export class FormPermissionComponent {
    list: Array<any>;
    formlist: Array<any>;
    roleId: string;
    source: any;
    FormPermissions = [];
    IschkAdd = false;
    IschkEdit = false;
    IschkView = false;
    IschkReport = false;
    IschkDelete = false;
    IschkRoles = false;

    model: any;
    msg: any;
    message;
    expanded = false;
    //selectedRoleList: Array<any> = new Array<any>();

    userId: string;
    rolename: any;
    IschkTblRole = false;
    isChecked = false;

    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: PermissionsService) {
        this.roleId = this.route.snapshot.paramMap.get('_id');
        this.rolename = this.route.snapshot.paramMap.get('rolename');
        this.list = [{ rolename: this.rolename, _id: this.roleId }];
        // this.selectedRoleList = new Array<any>();
        // if (this.roleId !== null && this.rolename !== null) {
        //     this.selectedRoleList.push({
        //         _id: this.roleId, email: this.rolename
        //     });
        // }
        this.LoadData(this.roleId);
    }

    private LoadData(roleId) {
        this._dataService.findAllActiveForms(roleId).subscribe(data => { this.list = data; });
    }

    selectAll(selectedColumn, checked) {
        switch (selectedColumn) {
            case 'chkAdd':
                this.IschkAdd = checked; break;
            case 'chkEdit':
                this.IschkEdit = checked; break;
            case 'chkView':
                this.IschkView = checked; break;
            case 'chkReport':
                this.IschkReport = checked; break;
            case 'chkDelete':
                this.IschkDelete = checked; break;
        }
    }

    selectHeaderCheck(selectedColumn, checked) {
        const checkedbox = document.querySelectorAll('input.' + selectedColumn + ':checked').length;
        const allcheckbox = document.querySelectorAll('input.' + selectedColumn).length;
        const chk: any = document.querySelector('input#' + selectedColumn);

        if (checkedbox === allcheckbox) {
            chk.checked = true;
        } else {
            chk.checked = false;
        }
    }

    selectedRole(event) {
        const selected: any = document.querySelectorAll('#checkboxes input:checked');
        console.log(event.target.checked, selected.length);


        if (event.target.checked) {
            {
                this.LoadData(event.target.id);
            }
        } else { this.clearForm(); this.IschkRoles = false; }
    }

    showCheckboxes() {
        const checkboxes = document.getElementById('checkboxes');
        if (!this.expanded) {
            checkboxes.style.display = 'block';
            this.expanded = true;
        } else {
            checkboxes.style.display = 'none';
            this.expanded = false;
        }
    }

    displaydata(event) {
        if (event.target.value !== undefined && event.target.value !== null) {
            this._dataService.findRoleForForms(event.target.value)
                .subscribe(data => {
                    this.formlist = data.length > 0 ? data : this.formlist.length = 0;
                    const checkboxes = document.getElementById('checkboxes');
                    if (this.formlist.length > 0) {
                        checkboxes.style.display = 'block';
                        this.expanded = true;
                    } else {
                        checkboxes.style.display = 'none';
                        this.expanded = false;
                    }
                });

        } else {
            this.formlist.length = 0;
        }
    }

    save() {
        const rows: any = document.querySelectorAll('#tblBody tr');
        const selectedrole: any = document.querySelector('#checkboxes input:checked');
        const selectedchecks: any = document.querySelectorAll('#tblBody input:checked').length;
        if (selectedrole.length === 0) {
            this.message = 'Select role';
            return;
        }

        if (selectedchecks > 0) {
            const len = rows.length;
            let models = []
            let ids = [];
            for (let index = 0; index < len; index++) {
                const celllist: any = rows[index].cells;
                const id = celllist[0].innerHTML;
                ids = ids.concat(id);
                models = models.concat({
                    _id: id,
                    Roles: {
                        RoleId: selectedrole.value,
                        FormPermissions: {
                            Add: celllist[2].querySelector('input').checked,
                            Edit: celllist[3].querySelector('input').checked,
                            View: celllist[4].querySelector('input').checked,
                            Report: celllist[5].querySelector('input').checked,
                            Delete: celllist[6].querySelector('input').checked
                        }
                    }
                });

            }
            this._dataService.updateformpermissions(ids, models)
                .subscribe(user => { this.model = user; this.saveResponse(user.json()); },
                    error => this.msg = <any>error);
        } else {
            this.message = 'Select any item';
        }
    }

    private saveResponse(data: any) {
        if (!data.success) {
            this.message = data.message;
        } else {
            this.message = data.message;
        }
        this.clearForm();
    }

    private clearForm() {
        const checked = false;
        this.IschkAdd = checked;
        this.IschkEdit = checked;
        this.IschkView = checked;
        this.IschkReport = checked;
        this.IschkDelete = checked;
        let chk: any = document.querySelector('#chkAdd');
        chk.checked = false;
        chk = document.querySelector('#chkEdit');
        chk.checked = false;
        chk = document.querySelector('#chkReport ');
        chk.checked = false;
        chk = document.querySelector('#chkView ');
        chk.checked = false;
        chk = document.querySelector('#chkDelete');
        chk.checked = false;
    }
}

