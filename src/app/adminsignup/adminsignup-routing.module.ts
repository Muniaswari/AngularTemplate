import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminSignupComponent } from './adminsignup.component';

const routes: Routes = [
    {
        path: '', component: AdminSignupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminSignupRoutingModule {
}
