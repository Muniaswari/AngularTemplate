import { Component } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { MasterService } from '../../../../shared/services/master.service';
import { AuthService } from '../../../../shared/guard/auth.service';
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
    constructor(public constants: Constants,
        private route: ActivatedRoute,
        private authService: AuthService,
        private _dataService: MasterService) {
        this.formname = this.route.snapshot.paramMap.get('FormName');
        this.LoadData(this.formname          );
    }

    private LoadData(formname) {
        this._dataService.tableColumns(formname)
            .subscribe(data => {
                this.list = data.json();
                console.log(this.list);
            });
    }
dragenter($event) {
    const target = $event.currentTarget;
    // if (this.isbefore(this.source, target)) {
    //     target.parentNode.insertBefore(this.source, target); // insert before
    // }
    // else {
        target.parentNode.insertBefore(this.source, target.nextSibling); //insert after
  //  }
}


/**
 * LIST ITEM DRAG STARTED
 */
dragstart($event) {
    this.source = $event.currentTarget;
    $event.dataTransfer.effectAllowed = 'move';
}
    // allowDrop(ev) {
    //      ev.preventDefault();
    //      }

    // drag(ev) {
    //     ev.dataTransfer.setData("Text", ev.target.id);
    // }

    // drop(ev) {
    //     ev.preventDefault();
    //     let b = ev.dataTransfer.getData('Text');
    //     ev.target.appendChild(document.getElementById(b));
    // }
}
