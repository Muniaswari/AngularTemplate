import { routerTransition } from '../../router.animations';
import { Component } from '@angular/core';
import { FormDesignService } from '../../shared/services/formdesign.service'
import { Constants } from '../../shared/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-formbuilder',
    templateUrl: './formbuilder.component.html',
    styleUrls: ['./formbuilder.component.scss'],
    animations: [routerTransition()]
})
export class FormBuilderComponent {
    idList = [];
    model: any;
    message;
    data: any;
    currentPage = 1;
    list: Array<any> = [];
    category = false;
    IschkTbl = false;

    fields: any = ['Title'];
    searchvalue = 'undefined';
    searchField = 'undefined';
    
    formlists: Array<any> = [];
    tablelists: Array<any> = [];
    processing = false;
    selectedRows: Array<any>;

    constructor(public constants: Constants, 
        private route: ActivatedRoute,
        private _dataService: FormDesignService) {
        this.getData();
    }

    search(info: any) {
        this.currentPage = 1;
        this.list = [];
        this.searchvalue = info.value === "" ? 'undefined' : info.value;
        this.searchField = info.field;
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

    private selectRow($event) {
        const target: any = $event;
        const allcheckbox = document.querySelectorAll('input.chkTbl').length;
        const chk: any = document.querySelector('input#chkSelectAll');
        const checkedbox = document.querySelectorAll('input.chkTbl:checked');
        const len = checkedbox.length;
        if (len === allcheckbox) {
            chk.checked = true;
        } else {
            chk.checked = false;
        }

        const index = this.idList.findIndex(item => item === target.value);
        if (index === -1 && target.checked === true) {
            this.idList.push(target.value);
        } else if (target.checked === false) {
            this.idList.splice(index, 1);
        }
    }

    private selectAll(checked) {
        this.IschkTbl = checked;
    }

    private delete() {
        console.log(this.idList);
        this._dataService.delete(this.idList, { DeletedBy: localStorage.getItem('CurLoggedUser') })
            .subscribe(response => {
                const table: any = document.getElementById('tbodyList');

                const checkedbox: any = document.querySelectorAll('input.chkTbl:checked');
                const len = checkedbox.length;
                for (let index = 0; index < len; index++) {
                    table.removeChild(checkedbox[index].parentNode.parentNode);
                }
                alert('Deleted Successfully!');
            }, error => this.message = <any>error);
      
    }

    private saveResponse(data: any) {
        if (!data.success) {
            this.message = data.message;
        } else {
            this.message = data.message;
        }
    }
}