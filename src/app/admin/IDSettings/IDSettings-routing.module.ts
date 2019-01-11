import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IDSettingsListComponent } from './IDSettingsList.component';
import {
   IDSettingsComponent
} from './components';
const routes: Routes = [
    { path: '', component: IDSettingsListComponent }, 
    { path: 'idsettingssetup/:_id ', component: IDSettingsComponent },
    { path: 'idsettingssetup', component: IDSettingsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IDSettingsRoutingModule {
}
