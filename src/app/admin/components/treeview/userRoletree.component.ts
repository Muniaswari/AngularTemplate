import { Component, Input} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../shared/constants';
import { MasterService } from '../../../shared/services/master.service';
import { AuthService } from '../../../shared/guard/auth.service';
import { RoleService } from '../../../shared/services/role.service'

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'userroletree-view',
    templateUrl: './userRoletree.component.html',
    styleUrls: ['./userRoletree.component.scss']
})
export class UserRoleTreeComponent {
    @Input() menuList: any;
    form: FormGroup;
    model;
    message;
    messageClass;
    processing = false;
    list: any[];
    roles: any ;
    msg: String;
    constructor(private formBuilder: FormBuilder, 
        public constants: Constants,
        private authService: AuthService,
        private _dataService: RoleService) {
    }

    toggleChildren(node: any) {
        // to do
        node.Visible = !node.Visible;
    }

    onClick(event) {
        // const li = this.renderer.createElement('li');
        // const text = this.renderer.createText('Click here to add li');
        // this.renderer.appendChild(li, text);
        // this.renderer.appendChild(event.srcElement.parentNode.querySelector('ul'), li);
    }
}
