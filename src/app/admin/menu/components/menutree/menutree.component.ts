import { Component, Input } from '@angular/core';
import { Constants } from '../../../../shared/constants';
import { AuthService } from '../../../../shared/guard/auth.service';
import { MenuService } from '../../../../shared/services/menu.service'

@Component({
    selector: 'app-menutree',
    templateUrl: './menutree.component.html',
    styleUrls: ['./menutree.component.scss']
})
export class MenuTreeComponent {

    @Input() menuList: any;
    model;
    message;
    messageClass;
    processing = false;
    list: any[];
    roles: any;
    msg: String;
    source: any;

    constructor(public constants: Constants,
        private authService: AuthService,
        private _dataService: MenuService) {
    }

    toggleChildren(node: any) {
        // to do
        node.Visible = !node.Visible;
    }

    dragenter($event) {
        const target = $event.currentTarget;
        target.parentNode.insertBefore(this.source, target.nextSibling); //insert after
    }
    
    dragstart($event) {
        this.source = $event.currentTarget;
        $event.dataTransfer.effectAllowed = 'move';
    }
    
    onClick(event) {
        // const li = this.renderer.createElement('li');
        // const text = this.renderer.createText('Click here to add li');
        // this.renderer.appendChild(li, text);
        // this.renderer.appendChild(event.srcElement.parentNode.querySelector('ul'), li);
    }
}