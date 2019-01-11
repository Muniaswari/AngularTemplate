import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './adminlogin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLoginComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminLoginRoutingModule {}
