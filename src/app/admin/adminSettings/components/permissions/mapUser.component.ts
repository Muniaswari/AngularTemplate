import { Component } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { AuthService } from '../../../../shared/guard/auth.service';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-mapuser',
    templateUrl: './mapUser.component.html',
    styleUrls: ['./mapUser.component.scss'],
    animations: [routerTransition()]
})

export class MapUserComponent {
    list: Array<any>;
    roleId: string;
    source: any;
    model: any;
    msg: any;
    role: any;
    IschkUsers = false;
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: PermissionsService) {
        this.roleId = this.route.snapshot.paramMap.get('_id');
        this.role = this.route.snapshot.paramMap.get('role');
        this.LoadData();
    }

    private LoadData() {
        this._dataService.findAllActiveUsers(this.roleId)
            .subscribe(data => { this.list = data; });
    }

    selectAll(checked) {
        this.IschkUsers = checked;
    }
    
    selectHeaderCheck(checked) {
        const checkedbox: any = document.querySelectorAll('input.chkTblUsers:checked').length;
        const headercheckbx: any = document.querySelectorAll('#chkSelectAll').length;
        const allcheckedbox: any = document.querySelectorAll('input.chkTblUsers').length;

        if (checkedbox === allcheckedbox) {
            headercheckbx.checked = true;
        } else {
            headercheckbx.checked = false;
        }
    }

    save() {
        const chks = document.querySelectorAll('input.chkTblUsers:checked');
        const len = chks.length;
        let users = [];
        for (let i = 0; i < len; i++) {
            users = users.concat(chks[i].getAttribute('value'));
        }
        this.model = { _id: this.roleId, Users: users };
        this._dataService.updateusermapping(this.model._id, this.model)
            .subscribe(user => { this.model = user; },
                error => this.msg = <any>error);
    }
}
