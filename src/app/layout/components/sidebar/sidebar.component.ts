import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../../shared/guard/auth.service';
import { Constants } from '../../../shared/constants';
import { MenuService } from '../../../shared/services/menu.service'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    isActive = false;
    showMenu = '';
    pushRightClass = 'push-right';
    currentUser = '';
    menus: Array<any> = [];

    constructor(private translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        private _dataService: MenuService,
        public constants: Constants) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.currentUser = localStorage.getItem('CurLoggedUser');
        this.LoadMenu();
    }

    passdata(form, url, formpermissions) {
        console.log(formpermissions);
        this.constants.formId = form; 
    //    this.constants.roleId = formpermissions.RoleId;
        this.constants.formPermssions = formpermissions;
        this.router.navigate([url]);
    }
    private LoadMenu() {
        this._dataService.findMenus(localStorage.getItem('CurLoggedUser'))
            .subscribe(data => {
                const record = data.json();
                if (record !== null && record.length > 0) {
                    this.menus = this.menus.concat(record);
                }
            });
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        this.authService.logout();
    }
}
