import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { RoleService } from '../../../../shared/services/role.service'
import { Constants } from '../../../../shared/constants';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    animations: [routerTransition()]
})
export class RoleComponent implements OnInit {
    idList = [];
    model: any;
    message;
    data: any;
    currentPage = 1;
    list: Array<any> = [];
    category = false;
    IschkTbl = false;

    fields: any = ['FormName'];
    searchvalue = 'undefined';
    searchField = 'undefined';
    
    constructor(public constants: Constants,
        private _dataService: RoleService) {
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
        this._dataService.getPage(this.currentPage,
            this.searchField, this.searchvalue)
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
            }, error => this.message = <any>error);
    }
    
    public ngOnInit() {
    }

}
