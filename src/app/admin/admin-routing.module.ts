import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'admindashboard' },
            { path: 'admindashboard', loadChildren: './admindashboard/admindashboard.module#AdminDashboardModule' },
            { path: 'menu', loadChildren: './menu/menu.module#MenuModule' },
            { path: 'idsettings', loadChildren: './IDSettings/IDSettings.module#IDSettingsModule' },
            { path: 'formbuilder', loadChildren: './formbuilder/formbuilder.module#FormBuilderModule' },
            { path: 'settings', loadChildren: './adminSettings/adminSettings.module#AdminSettingsModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }



