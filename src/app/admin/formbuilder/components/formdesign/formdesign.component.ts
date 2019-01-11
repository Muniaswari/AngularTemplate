// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_draganddrop2

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { FormValidation } from '../../../../shared/common/formValidation';
import { FormDesignService } from '../../../../shared/services/formdesign.service';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-formdesign',
    templateUrl: './formdesign.component.html',
    styleUrls: ['./formdesign.component.scss'],
    animations: [routerTransition()]
})

export class FormDesignComponent {
    model = {
        _id: 0,
        Columns: '',
        Style: '',
        Title: '',
        FormContent: '',
        DesignContent: '',
        CreatedBy: '',
        ModifiedBy: '',
        Modified: []
    };

    @ViewChild('divDesign')
    d1: ElementRef;
    list: any[];
    msg: String;
    source: any; divCount = 1;
    controlProperty;
    controlList = [];
    tab: number;
    controlCount = 0;
    divColumnList: any;
    messageClass;
    message;
    processing = false;
    nameValid;
    nameMessage;
    closeResult: string;
    maxId = 0;
    data: any;

    public isCollapsed = false;
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        public formValidation: FormValidation,
        private _dataService: FormDesignService) {
        const id = this.route.snapshot.paramMap.get('_id');
        console.log(id);
        if (id !== undefined && id !== null) {
            this.model._id = Number(id);
        }
        this.FetchData();
        this.divColumnList = [{ id: 'divDesign1', name: 'divDesign1' }];
    }

    toggle(id) {
        const div: any = document.getElementById(id);
        const parentdiv: any = div.parentNode;
        if (div.classList.contains('show')) {
            div.classList.remove('show');
            parentdiv.querySelector('.togglecls').className = 'togglecls fa fa-chevron-right'
        } else {
            parentdiv.querySelector('.togglecls').className = 'togglecls fa fa-chevron-down';
            div.classList.add('show');
        }
    }

    dragenter($event) {
        const target = $event.currentTarget;
        // if (this.isbefore(this.source, target)) {
        //     target.parentNode.insertBefore(this.source, target); // insert before
        // }
        // else {
        console.log(this.source);
        target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
        //  }
    }

    dragstart($event) {
        this.source = $event.currentTarget;
        $event.dataTransfer.effectAllowed = 'move';
    }

    refreshPreview() {
        const sourceDiv = document.querySelector('#divDesign'); // row
        const temp = document.createElement('div');

        const targetDiv = document.querySelector('#divPreview'); // row
        temp.innerHTML = sourceDiv.innerHTML;
        const divs = temp.querySelectorAll('.form-group'); // column div
        const controlCount = divs.length;
        let div: any;
        let link;
        for (let index = 0; index < controlCount; index++) {
            div = divs[index];
            link = div.querySelector('a');
            div.removeChild(link);
            div.className = 'form-group';
            div.setAttribute('style', '');
            div.setAttribute('draggable', '');
        }
        targetDiv.innerHTML = temp.innerHTML;
    }

    FormColumns($event) {
        const target = $event.currentTarget;
        let len = parseInt(target.value, 0);
        let selectedColumns = 0;
        const parentDiv: any = document.querySelector('#divDesign'); // row
        let divs = parentDiv.querySelectorAll('.divDesign'); // column div
        let divid;
        const divLen = divs.length; // no of column divs
        selectedColumns = len - divLen; // new column
        let deletedivlen = divLen - len; // if column size reduced
        if (selectedColumns < 1) { // remove extra columns and move all controls to adjacent column div
            while (deletedivlen >= 1) {
                const div: any = divs[deletedivlen];
                const elem = div.querySelectorAll('.form-group');
                const controlCount = elem.length;
                for (let index = 0; index < controlCount; index++) {
                    divs[deletedivlen - 1].appendChild(elem[index]);
                }
                parentDiv.removeChild(div);
                this.divColumnList.pop(div.id);
                this.divCount--;
                deletedivlen--;
            }

        } else {// add new column div
            for (let index = 0; index < selectedColumns; index++) {
                this.divCount++;
                divid = 'divDesign' + this.divCount;
                const controlDiv = document.createElement('div');
                controlDiv.className = ' divDesign droppedcontrol';
                controlDiv.setAttribute('id', divid);
                this.divColumnList.push({ id: divid, name: divid });
                parentDiv.appendChild(controlDiv);
            }
        }

        divs = parentDiv.querySelectorAll('.divDesign'); // column div
        len = divs.length;
        const colSize = 12 / len; // div size
        const columnClass = 'col-sm-' + colSize; // div class
        for (let index = 0; index < len; index++) {
            //  divid = 'divDesign' + divLen;
            const div = divs[index];
            div.className = columnClass + ' divDesign droppedcontrol';
        }
    }

    controldivClick($event) {
        this.changecontrolDivClass();
        const target = $event.currentTarget;
        target.className = 'form-group droppedcontrolClick';

        const ddlcolumns: any = document.querySelector('#ddldivColumns');
        ddlcolumns.value = target.parentNode.id;
        let control = target.querySelector('.form-control');
        if (control === null || control === undefined) {
            control = target.querySelector('div');
        }

        const ddlcontrol: any = document.querySelector('#ddlSelectedControl');
        if (ddlcontrol !== undefined && ddlcontrol !== null) {
            ddlcontrol.value = control.id;
        }
        this.findControlType(control);
    }

    findControlType(control) {
        const classname: string = control.className;
        this.controlProperty = classname.split(' ')[0];
    }

    addDataDropDown(valuecontrol, target) {
        const values: Array<string> = valuecontrol.split('\n');
        const len = values.length;
        const options = [];
        for (let index = 0; index < len; index++) {
            options.push('<option value=\'' + values[index] +
                '\' >' + values[index] + '</option>');
        }
        target.innerHTML = options.join('');
    }

    addDatachoice(valuecontrol, target, name, controltype) {
        const values: Array<string> = valuecontrol.split('\n');
        const len = values.length;
        const options = [];
        for (let index = 0; index < len; index++) {
            options.push('<div class=\"form-check\"><label>' +
                '<input type=\"' + controltype + '\" name=\"' + name + '\" value =\"' +
                values[index] + '\"/>' + values[index] + '</label></div>');
        }
        target.innerHTML = options.join('');
    }

    FormInformation($event, controltype) {
        const target = $event.currentTarget;
        if (target.value === '') {
            return;
        }
        switch (controltype) {
            case 'class':
                {
                    const parentDiv = document.querySelector('#divPreviewForm'); // row
                    parentDiv.className = 'card-header bg-' + target.value;
                    break;
                }
            case 'title':
                {
                    const formtitle: any = document.querySelector('#formHeader'); // row
                    formtitle.innerHTML = target.value;
                    break;
                }
            default:
                break;
        }
    }

    UpdateControlValue($event, controltype) {
        const target = $event.currentTarget;
        if (target.value === '') {
            return;
        }
        let control: any;
        let label;
        const parentDiv = document.querySelector('#divDesign'); // row
        const divs = parentDiv.querySelector('.droppedcontrolClick'); // column div
        const txtclass: any = document.querySelector('#txtClassName');
        if (divs !== null && divs !== undefined) {
            control = divs.querySelector('.form-control');
            label = divs.querySelector('.control-label');
            if (control === null || control === undefined) {
                control = divs.querySelector('div');
            }
            const controlvalue: string = target.value;
            switch (controltype) {
                case 'class':
                    {
                        const sizeconttrl: any = document.querySelector('#ddlControlSize');
                        let classtext;

                        if (this.controlProperty === 'radio' || this.controlProperty === 'checkbox') {
                            const choices = control.querySelectorAll('label');
                            const len = choices.length;
                            if (target.id === 'ddlControlSize') {

                            } else {
                                for (let index = 0; index < len; index++) {
                                    choices[index].className = controlvalue;
                                }
                            }
                            classtext = 'checkbox ' + (controlvalue === 'form-control' ? '' :
                                sizeconttrl.value) + ' ' + txtclass.value;

                        } else {
                            classtext = 'form-control ' + controlvalue + ' ' +
                                sizeconttrl.value + ' ' + txtclass.value;

                        }
                        control.className = classtext;
                        break;
                    }
                case 'text':
                    {
                        label.textContent = controlvalue;
                        break;
                    }
                case 'type':
                    {
                        control.setAttribute('type', controlvalue);
                        break;
                    }
                case 'value':
                    {
                        this.addDataDropDown(controlvalue, control);

                        break;
                    }
                case 'radiovalue':
                    {
                        this.controlCount++;
                        control = document.querySelector('.radio');
                        control.innerHTML = '';
                        let valuecontrol: any;
                        let content: string;
                        if (this.controlProperty === 'radio') {
                            control = document.querySelector('.radio');
                            valuecontrol = document.querySelector('#txtOptionsradio');
                            content = valuecontrol.value;
                        } else {
                            control = document.querySelector('.checkbox');
                            valuecontrol = document.querySelector('#txtOptionscheck');
                            content = valuecontrol.value;
                        }
                        this.addDatachoice(content, control,
                            this.controlProperty + this.controlCount, this.controlProperty);
                        divs.appendChild(control);
                        break;
                    }
                case 'required':
                    {
                        control.setAttribute('required', controlvalue);
                        break;
                    }
                case 'row':
                    {
                        control.setAttribute('rows', controlvalue);
                        break;
                    }
                case 'placeholder':
                    {
                        control.setAttribute('placeholder', controlvalue);
                        break;
                    }
                case 'id':
                    {
                        control.setAttribute('id', controlvalue);
                        break;
                    }
                default:
                    break;
            }
        }
    }

    removeControl($event) {
        const target = $event.currentTarget;
        const parentDiv = target.parentNode;

        let control = parentDiv.querySelector('.form-control');
        if (control === null || control === undefined) {
            control = parentDiv.querySelector('div');
        }

        this.controlList.splice(this.controlList.findIndex(x => x === control.id), 1);
        parentDiv.parentNode.removeChild(parentDiv);

    }

    changecontrolDivClass() {
        const parentDiv = document.querySelector('#divDesign'); // row
        const divs = parentDiv.querySelector('.droppedcontrolClick'); // column div
        if (divs !== null && divs !== undefined) {
            divs.className = 'form-group droppedcontrol'; // control
        }
    }

    selectedControlFocus($event) {
        this.changecontrolDivClass();
        const target = $event.currentTarget;
        const control: any = document.getElementById(target.value); // column div
        this.controlProperty = control.id
        this.findControlType(control);
        if (control !== null && control !== undefined) {
            const divs = control.parentNode;
            divs.className = 'form-group droppedcontrolClick'; // control
        }
    }

    controls($event) {
        this.changecontrolDivClass();

        const target = $event.currentTarget;
        this.controlProperty = target.id;
        const parentDov: any = document.querySelector('#ddldivColumns');
        const form = document.querySelector('#' + parentDov.value);
        const controlDiv = document.createElement('div');
        const deleteControl = document.createElement('a');
        let control;

        controlDiv.className = 'form-group droppedcontrolClick';
        controlDiv.setAttribute('style', 'cursor: move');
        controlDiv.setAttribute('draggable', 'true');

        deleteControl.setAttribute('class', 'pull-right fa fa-trash');
        deleteControl.setAttribute('href', 'Javascript:void(0)');
        deleteControl.addEventListener('click', (event) => {
            this.removeControl(event);
        });
        controlDiv.appendChild(deleteControl);
        controlDiv.addEventListener('click', (event) => {
            this.controldivClick(event);
        });
        controlDiv.addEventListener('dragenter', (event) => {
            this.dragenter(event);
        });
        controlDiv.addEventListener('dragstart', (event) => {
            this.dragstart(event);
        });
        const controlId = target.id + this.controlCount++;
        this.controlList.push(controlId);
        switch (target.id) {
            case 'textbox':
                {
                    control = document.createElement('input');
                    control.type = 'text';
                    control.className = target.id + ' form-control';
                    break;
                }
            case 'textarea':
                {
                    control = document.createElement('textarea');
                    control.className = target.id + ' form-control';
                    break;
                }
            case 'dropdown':
                {
                    control = document.createElement('select');
                    control.className = target.id + ' form-control';
                    control.innerHTML = '<option value=\"Option One\" >Option One</option>' +
                        '<option value=\"Option Two\" >Option Two</option>';
                    break;
                }
            case 'radio':
                {
                    control = document.createElement('div');
                    control.innerHTML = '<label  class=\"form-check"><input type=\"radio\" name=\"radio' +
                        this.controlCount + '\" value =\"Option One\"/>Option One</label>' +
                        '<label class=\"form-check"><input type=\"radio\" name=\"radio' +
                        this.controlCount + '\" value =\"Option Two\"/>Option Two</label>';
                    control.className = target.id + ' checkbox';
                    break;
                }
            case 'checkbox':
                {
                    control = document.createElement('div');
                    control.innerHTML = '<label class=\"form-check"><input type=\"checkbox\" name=\"' +
                        this.controlCount + '\" value =\"Option One\"/>Option One</label>' +
                        '<label class=\"form-check"><input type=\"checkbox\" name=\"' +
                        (this.controlCount + 1) + '\" value =\"Option Two\"/>Option Two</label>';
                    control.className = target.id;
                    break;
                }
            case 'button':
                {
                    control = document.createElement('input');
                    control.type = 'button';
                    control.textContent = this.controlProperty;
                    control.className = target.id + ' form-control';
                    control.value = 'button';
                    break;
                }
            default:
                break;
        }
        if (target.id !== 'button') {
            const labelCtrl = document.createElement('Label');
            labelCtrl.className = 'control-label';
            labelCtrl.textContent = this.controlProperty;
            controlDiv.appendChild(labelCtrl);
        }
        control.setAttribute('id', controlId);
        controlDiv.appendChild(control);
        form.appendChild(controlDiv);
    }

    save() {
            this.refreshPreview();
        const forminfo = this.model;
        console.log(this.model);
        this.model.FormContent = document.getElementById('divpanelPreview').innerHTML;
        this.model.DesignContent = document.getElementById('divDesign').innerHTML;
        console.log(this.model);

        if (this.model._id > 0) {
            this.model.ModifiedBy = localStorage.getItem('CurLoggedUser');
            this._dataService.update(forminfo._id, this.model)
                .subscribe(data => { this.saveResponse(data); });
        } else {
            this.model.CreatedBy = localStorage.getItem('CurLoggedUser');
            this.model._id = this.maxId + 1;
            this._dataService.save(this.model)
                .subscribe(data => { this.saveResponse(data); });
        }
    }

    private saveResponse(data: any) {
        if (data.success) {
            this.FetchData();
        }
        alert(data.message);
    }

    private FetchData() {
        console.log(this.model);
        return this._dataService.FindById(this.model._id)
            .subscribe(data => {
                console.log(data);
                if (data.maxIdData !== null && data.maxIdData.length > 0) {
                    this.maxId = data.maxIdData[0]._id;
                }
                if (data.editRow !== null) {
                    const forminfo = data.editRow;
                    this.model.Columns = forminfo.Columns;
                    this.model.Style = forminfo.Style;
                    this.model.Title = forminfo.Title;
                    document.getElementById('divpanelPreview').innerHTML = forminfo.FormContent;
                    document.getElementById('divDesign').innerHTML = forminfo.DesignContent;
                    this.model.Modified = forminfo.Modified !== undefined &&
                        forminfo.Modified.length > 0 &&
                        forminfo.Modified !== null ? forminfo.Modified : [];
                    const divs: any = document.getElementById('divDesign').querySelectorAll('.droppedcontrol');
                    const len = divs.length;
                    let controlDiv: any;
                    let deleteControl: any;
                    for (let index = 0; index < len; index++) {
                        controlDiv = divs[index];
                        deleteControl = controlDiv.querySelector('a');
                        deleteControl.addEventListener('click', (event) => {
                            this.removeControl(event);
                        });
                        controlDiv.addEventListener('click', (event) => {
                            this.controldivClick(event);
                        });
                        controlDiv.addEventListener('dragenter', (event) => {
                            this.dragenter(event);
                        });
                        controlDiv.addEventListener('dragstart', (event) => {
                            this.dragstart(event);
                        });
                    }
                }
            }, error => { this.errorResponse(<any>error) });
    }

    private errorResponse(err) {
        this.messageClass = 'alert alert-success';
        this.message = err;
    }
}
