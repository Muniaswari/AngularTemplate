import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PricingModule } from './pricing/pricing.module';
import { ConfigurationModule } from './configuration/configuration.module';
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: () => DashboardModule },
            { path: 'configuration', loadChildren: () => ConfigurationModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
