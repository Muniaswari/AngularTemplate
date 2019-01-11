import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../../../shared/constants';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/guard/auth.service';
import { routerTransition } from '../../../../router.animations';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [routerTransition()],
})

export class UsersComponent {
    currentPage = 1;
    msg: String;
    data: any;
    closeResult: any;
    list: Array<any> = [];
    disableView = false;

    constructor(public constants: Constants,
        private authService: AuthService,
        private modalService: NgbModal,
        private _dataService: UserService) {
        this.disableView = this.authService.checkReadPermissions(this.constants.formId, this.constants.formPermssions);
        this.getData();
    }

    onScroll(event: any) {
        if (((window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight)
            || ((window.innerHeight + document.documentElement.scrollTop) >= document.body.offsetHeight)) {
            const rows: any = document.getElementById('tbodyList').querySelectorAll('tr');
            console.log(rows.length);
            if (rows.length < this.constants.RecordTotal) {
                console.log('scrolled');
                this.getData();
            }
        }
    }

    private getData() {
        this._dataService.findUsers(this.currentPage,0)
            .subscribe(data => {
                const records = data.json();
                console.log(records);

                if (records !== null && records.Pages.length > 0) {
                    this.list = this.list.concat(records.Pages);
                }
                if (this.currentPage === 1) {
                    this.constants.RecordTotal = records.Total;
                }
                this.currentPage++;
            }, error => this.msg = <any>error);
    }
 
    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    viewUser(id: any) {
        console.log(id);
        this._dataService.getById(id)
            .subscribe(info => { this.data = info; });
    }

}
