import { Component } from '@angular/core';
import { routerTransition } from '../../../../router.animations';

@Component({
    selector: 'app-settings-home',
    templateUrl: './settingsHome.component.html',
    styleUrls: ['./settingsHome.component.scss'],
    animations: [routerTransition()]
})
export class SettingsHomeComponent {

    constructor() { }
}
