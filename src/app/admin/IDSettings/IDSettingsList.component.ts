import { routerTransition } from '../../router.animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/guard/auth.service';
import { MenuService } from '../../shared/services/menu.service'
import { Constants } from '../../shared/constants';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'app-idsettingslist',
    templateUrl: './IDSettingsList.component.html',
    styleUrls: ['./IDSettingsList.component.scss'],
    animations: [routerTransition()]
})

export class IDSettingsListComponent {
    public list: Array<any> = [];
    idList = [];
    IschkTbl = false;
    message;
    
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: MenuService) { this.LoadData() }

  
      selectRow($event) {
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

     selectAll(checked) {
        this.IschkTbl = checked;
    }

     delete() {
        console.log(this.idList);
        this._dataService.delete(this.idList, { DeletedBy: localStorage.getItem('CurLoggedUser') })
            .subscribe(response => {
                const table: any = document.getElementById('tbodyList');
                const checkedbox: any = document.querySelectorAll('input.chkTbl:checked');
                const len = checkedbox.length;
                for (let index = 0; index < len; index++) {
                    table.removeChild(checkedbox[index].parentNode.parentNode);
                }
                //    this.list.splice(this.data.indexOf(itemindex), 1);
                alert('Deleted Successfully!');
            }, error => this.message = <any>error);
    }

     LoadData() {
        this._dataService.findAll()
            .subscribe(data => {
                this.list = data.json();
                
            });
    }
}

