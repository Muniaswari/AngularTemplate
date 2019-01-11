import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSettingsRoutingModule } from './adminSettings-routing.module';
import { AdminSettingsComponent } from './adminSettings.component';
import { TreeViewComponent } from '../components/treeview/treeview.component';
import { UserRoleTreeComponent } from '../components/treeview/userRoletree.component';
import {
    MasterComponent,
    RoleFormComponent,
    RoleComponent,
    FieldSettingsComponent,
    MasterformComponent,
    UsersComponent,
    SettingsHomeComponent,
    FormPermissionComponent,
    MapUserComponent,
    MapRoleComponent
} from './components';
import {
    PageHeaderModule,
    ValidationSummaryModule,
    SearchModule
} from '../../shared';
import { RoleService } from '../../shared/services/role.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { UserService } from '../../shared/services/user.service';
import { MasterService } from '../../shared/services/master.service';

@NgModule({
    imports: [
        TranslateModule,
        CommonModule,
        AdminSettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(), SearchModule,
        ValidationSummaryModule,
        PageHeaderModule
    ],
    exports: [
        TranslateModule
    ],
    declarations: [
        TreeViewComponent,
        RoleFormComponent,
        RoleComponent,
        UserRoleTreeComponent,
        AdminSettingsComponent,
        UsersComponent,
        MasterComponent,
        FormPermissionComponent,
        MapUserComponent,
        MapRoleComponent,
        FieldSettingsComponent,
        MasterformComponent,
        SettingsHomeComponent

    ],
    providers: [
        RoleService,
        PermissionsService,
        UserService,
        MasterService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminSettingsModule { }
