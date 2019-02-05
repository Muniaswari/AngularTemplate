import { Component } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { MasterService } from '../../../../shared/services/master.service';
import { FormDesignService } from '../../../../shared/services/formdesign.service';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-fieldsettings',
    templateUrl: './fieldsettings.component.html',
    styleUrls: ['./fieldsettings.component.scss'],
    animations: [routerTransition()]
})

export class FieldSettingsComponent {
    list: Array<any>;
    formname: string;
    source: any;
    formdesignlist: Array<any>;

    idList = [];
    message;
    IschkFormTbl = false;

    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private _formdesignService: FormDesignService,
        private _dataService: MasterService) {
        this.formname = this.route.snapshot.paramMap.get('FormName');
        this.LoadData(this.formname);
    }

    LoadData(formname) {
        this._dataService.tableColumns(formname)
            .subscribe(data => {
                const info = data.json();
                this.list = info.TableColumns;
                this.formdesignlist = info.FormDesignList;
                console.log(info);
            });
    }

    FieldSetting($event, types) {
        const target: any = $event.currentTarget;
        const includedddl: any = document.querySelector('#ddlIncluded');
        let excludedddl: any;
        let selectedFields = includedddl.selectedOptions;
        let selectedIndex = includedddl.selectedIndex;
        switch (types) {
            case 'includedown':
                if (includedddl.length - 1 !== selectedIndex) {
                    includedddl.options[selectedIndex + 1].insertAdjacentElement('afterEnd',
                        includedddl.selectedOptions[0]);
                }
                break;
            case 'includeup':
                if (selectedIndex > 0) {
                    includedddl.options[selectedIndex - 1].insertAdjacentElement('beforeBegin',
                        includedddl.selectedOptions[0]);
                }
                break;
            case 'right':
                excludedddl = document.querySelector('#ddlExcluded');
                if (selectedFields.length > 0) {
                    excludedddl.appendChild(selectedFields[0]);
                }
                break;
            case 'left':
                excludedddl = document.querySelector('#ddlExcluded');
                selectedFields = excludedddl.selectedOptions;
                selectedIndex = excludedddl.selectedIndex;
                if (selectedFields.length > 0) {
                    includedddl.appendChild(selectedFields[0]);
                };
                break;
            case 'excludedown':
                excludedddl = document.querySelector('#ddlExcluded');
                selectedFields = excludedddl.selectedOptions;
                selectedIndex = excludedddl.selectedIndex;
                if (excludedddl.length - 1 !== selectedIndex) {
                    excludedddl.options[selectedIndex + 1].insertAdjacentElement('afterEnd',
                        excludedddl.selectedOptions[0]);
                }
                break;
            case 'excludeup':
                excludedddl = document.querySelector('#ddlExcluded');
                selectedFields = excludedddl.selectedOptions;
                selectedIndex = excludedddl.selectedIndex;
                if (selectedIndex > 0) {
                    excludedddl.options[selectedIndex - 1].insertAdjacentElement('beforeBegin',
                        excludedddl.selectedOptions[0]);
                }
                break;
            default:
                break;
        }
    }
    toggle(id) {
        const div: any = document.getElementById(id);
        const parentdiv: any = div.parentNode;
        if (div.classList.contains('show')) {
            div.classList.remove('show');
            parentdiv.querySelector('.togglecls').className = 'togglecls fa fa-plus'
        } else {
            parentdiv.querySelector('.togglecls').className = 'togglecls fa fa-minus';
            div.classList.add('show');
        }
    }

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

    }

    selectAll(checked) {
        this.IschkFormTbl = checked;
    }
}
