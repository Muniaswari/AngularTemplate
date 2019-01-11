import { routerTransition } from '../../router.animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/guard/auth.service';
import { MenuService } from '../../shared/services/menu.service'
import { Constants } from '../../shared/constants';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

$('[data-toggle="collapse"]').on('click', function () {
    alert("cli");
    //   $(document).find()  ;
    //  $(this).prevAll().addClass("active");
});

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [routerTransition()]
})
export class MenuComponent {
    public menuList: Array<any> = [];
    idList = [];
    IschkTbl = false;
    message;
    
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: MenuService) { this.LoadData() }

    toggleChildren($event) {
        const target = $event.currentTarget;
        const rows: any = document.querySelectorAll(target.parentNode.getAttribute('data-target'));

        if (target.classList.contains('fa-plus')) {
            target.classList.remove('fa-plus');
            target.classList.add('fa-minus');
        } else {
            target.classList.remove('fa-minus');
            target.classList.add('fa-plus');

            //  rows.prevAll.addClass('hide');
            //     rows.prevAll.removeClass('show');
            rows.forEach(function (el: any) {
                const condi = el.cells[3].getAttribute('data-target');
                const childrows: any = document.querySelectorAll(condi);
                childrows.forEach(function (childrow) {
                    if (childrow.classList.contains('show')) {
                        childrow.classList.remove('show');
                        childrow.classList.add('hide');
                    }
                });
            });
        }
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
                //    this.list.splice(this.data.indexOf(itemindex), 1);
                alert('Deleted Successfully!');
            }, error => this.message = <any>error);
    }

    private LoadData() {
        this._dataService.findAll()
            .subscribe(data => {
                this.menuList = data.json();
                if (this.menuList[0].SubMenu.length > 0) {

                }
            });
    }


}

