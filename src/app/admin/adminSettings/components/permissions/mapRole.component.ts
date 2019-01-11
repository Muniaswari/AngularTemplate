import { Component } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { AuthService } from '../../../../shared/guard/auth.service';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-maprole',
    templateUrl: './mapRole.component.html',
    styleUrls: ['./mapRole.component.scss'],
    animations: [routerTransition()]
})

export class MapRoleComponent {
    messageClass;
    message;
    rolelist: Array<any>[];
    selectedUserList: Array<any> = new Array<any>();
    list: Array<any>[];
    userId: string;
    model: any;
    msg: any;
    user: any;
    IschkTblRole = false;
    expanded = false;
    isChecked = false;
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: PermissionsService) {
        this.userId = this.route.snapshot.paramMap.get('_id');
        this.user = this.route.snapshot.paramMap.get('user');

        this.selectedUserList = new Array<any>();
        if (this.userId !== null && this.user !== null) {
            this.selectedUserList.push({
                _id: this.userId, email: this.user
            });
        } this.LoadData(this.selectedUserList);
    }

    private LoadData(userId) {
        this._dataService.findRoles('empty', userId === null || userId.length === 0 ? 'empty' : userId)
            .subscribe(data => {
                this.rolelist = data;
            });
    }
    // private LoadData() {
    //     this._dataService.findRoles('empty')
    //         .subscribe(data => {
    //             console.log(this.rolelist);
    //             this.rolelist = data;
    //         });
    // }
    // @HostListener('window:scroll', ['$event'])
    // onScroll($event: Event): void {
    //     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //     }
    // }
    // @HostListener('document:click', ['$event'])
    // onDocumentClicked(ev) {
    //     console.log('clicked', ev);
    // }

    selectedUser(event) {
        const index = this.selectedUserList.findIndex(user => user._id === event.target.id);

        if (index === -1 && event.target.checked === true) {
            this.selectedUserList.push({
                _id: event.target.id, email: event.target.value
            });
        } else if (event.target.checked === false) {
            this.selectedUserList.splice(index, 1);
        }
        // this.LoadData(this.selectedUserList.map(function (item) {
        //     return item._id
        // }));
    }

    removeUser(id) {
        const index = this.selectedUserList.findIndex(user => user._id === id);
        this.selectedUserList.splice(index, 1);

        const usercheckbox: any = document.getElementById(id);
        if (usercheckbox !== null) {
            usercheckbox.checked = false;
        }
        // this.LoadData(this.selectedUserList.map(function (item) {
        //     return item._id
        // }));
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

    selectAll(checked) {
        this.IschkTblRole = checked;
        const checkedbox = checked ? document.querySelectorAll('input.chkTblRole') : [];
        this.displayUsers(checkedbox);
    }

    selectHeaderCheck(checked) {
        const allcheckbox = document.querySelectorAll('input.chkTblRole').length;
        const chk: any = document.querySelector('input#chkTblRole');
        const checkedbox = document.querySelectorAll('input.chkTblRole:checked');
        const len = checkedbox.length;
        if (len === allcheckbox) {
            chk.checked = true;
        } else {
            chk.checked = false;
        }

        this.displayUsers(checkedbox);
    }

    displayUsers(checkedbox) {
        const len = checkedbox.length;
        if (checkedbox.length > 0) {
            const ids = [];
            for (let index = 0; index < len; index++) {
                ids.push(checkedbox[index].getAttribute('value'));
            }
            this._dataService.findUsersByRoles(ids)
                .subscribe(data => {
                    this.selectedUserList = data;
                });
        } else { this.selectedUserList.length = 0; }
    }

    clearUsers() {
        this.list.length = 0;
        const filtertxtbox: any = document.querySelector('#txtFilter');
        filtertxtbox.value = '';
    }

    displaydata(event) {
        if (event.target.value !== undefined && event.target.value !== null) {
            const usercategory: any = document.querySelector('#Category');
            console.log(usercategory.value);
            this._dataService.findUsersSearch(event.target.value, usercategory.value)
                .subscribe(data => {
                    this.list = data.length > 0 ? data : this.list.length = 0;
                    const checkboxes = document.getElementById('checkboxes');
                    if (this.list.length > 0) {
                        checkboxes.style.display = 'block';
                        this.expanded = true;
                    } else {
                        checkboxes.style.display = 'none';
                        this.expanded = false;
                    }
                });

        } else {
            this.list.length = 0;
        }
    }


    save() {
        const info = [];
        const chksRoles = document.querySelectorAll('input.chkTblRole:checked');
        const chksUsers = document.querySelectorAll('td.HideRow');
        let len = chksUsers.length;
        const users = [];
        if (len === 0) {
            this.message = 'Select Users...';
            return;
        }

        for (let index = 0; index < len; index++) {
            users.push(chksUsers[index].innerHTML);
        }

        len = chksRoles.length;
        if (len === 0) {
            this.message = 'Select roles...';
            return;
        }

        const ids = [];

        for (let index = 0; index < len; index++) {
            ids.push(chksRoles[index].getAttribute('value'));
            info.push({
                _id: chksRoles[index].getAttribute('value'),
                ModifiedBy: localStorage.getItem('CurLoggedUser'), Users: users
            });
        }

        this._dataService.updateusermapping(ids, info)
            .subscribe(user => {
                if (!user.json().success) {
                    this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                    this.message = 'Sever error...'; // Set error message
                } else {
                    this.messageClass = 'alert alert-success'; // Set bootstrap success class
                    this.message = 'Saved successfully....'; // Set success message
                }
            });
    }
}
