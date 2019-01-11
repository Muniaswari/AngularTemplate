import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminSettingsComponent } from './adminSettings.component';
import { ModuleWithProviders } from '@angular/core';
import {
    MasterComponent,
    UsersComponent,
    RoleComponent,
    MasterformComponent,
    SettingsHomeComponent,
    FieldSettingsComponent,
    FormPermissionComponent,
    MapUserComponent, 
    RoleFormComponent,
     MapRoleComponent
} from './components';

const routes: Routes = [
    { path: '', redirectTo: 'settingsHome' },
    { path: 'settingsHome', component: SettingsHomeComponent},
    { path: 'master', component: MasterComponent },
    { path: 'master/:category', component: MasterComponent },
    { path: 'masterform', component: MasterformComponent },
    { path: 'masterform/:_id', component: MasterformComponent },
    { path: 'fieldsettings/:_id :FormName', component: FieldSettingsComponent },
    { path: 'fieldsettings', component: FieldSettingsComponent },
    { path: 'formpermissions/:_id :rolename', component: FormPermissionComponent },
    { path: 'formpermissions', component: FormPermissionComponent },
    { path: 'mapuser/:_id :role', component: MapUserComponent },
    { path: 'mapuser', component: MapUserComponent },
    { path: 'maprole/:_id :user :type', component: MapRoleComponent },
    { path: 'maprole', component: MapRoleComponent },
    { path: 'role', component: RoleComponent },
     { path: 'users', component: UsersComponent },
    { path: 'users/:usercategory', component: UsersComponent },
    { path: 'roleform', component: RoleFormComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminSettingsRoutingModule { }
