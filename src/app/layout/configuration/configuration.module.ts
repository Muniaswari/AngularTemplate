import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InfiniteScrollerDirective } from '../../infinite-scroller.directive';
import { ConfigurationRoutingModule } from './configuration-routing.module';

import { ConfigurationComponent } from './configuration.component';
import { TreeViewComponent } from '../components/treeview/treeview.component';
import { UserRoleTreeComponent } from '../components/treeview/userRoletree.component';
import {
    RoleFormComponent, UserHomeComponent,
    RoleComponent,
    FieldSettingsComponent,
    UsersComponent,
    SettingsHomeComponent,
    FormPermissionComponent,
    MapUserComponent,
    MapRoleComponent
} from './components';
import { PageHeaderModule } from '../../shared';

import { RoleService } from '../../shared/services/role.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { UserService } from '../../shared/services/user.service';
import { MasterService } from '../../shared/services/master.service';

@NgModule({
    imports: [
        TranslateModule,
        CommonModule,
       ConfigurationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        PageHeaderModule
    ],
    exports: [
        TranslateModule
    ],
    declarations: [
        TreeViewComponent,
        RoleFormComponent,
        RoleComponent, UserHomeComponent,
        UserRoleTreeComponent,
     ConfigurationComponent,
        UsersComponent,
        FormPermissionComponent,
        MapUserComponent,
        MapRoleComponent,
        FieldSettingsComponent,
        SettingsHomeComponent,
        InfiniteScrollerDirective
    ],
    providers: [
        RoleService,
        PermissionsService,
        UserService,
        MasterService
    ]
})
export class ConfigurationModule { }
