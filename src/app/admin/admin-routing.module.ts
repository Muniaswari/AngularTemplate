import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FormBuilderModule } from './formbuilder/formbuilder.module';
import { MenuModule } from './menu/menu.module'; 
import { IDSettingsModule } from './IDSettings/IDSettings.module';
import { AdminSettingsModule } from './adminSettings/adminSettings.module';
const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: () => DashboardModule },
            { path: 'menu', loadChildren: () => MenuModule },
            { path: 'idsettings', loadChildren: () => IDSettingsModule },
            { path: 'formbuilder', loadChildren: () => FormBuilderModule },
            { path: 'settings', loadChildren: () => AdminSettingsModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }



