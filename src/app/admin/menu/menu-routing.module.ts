import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import {
    MenucreateComponent
} from './components';
const routes: Routes = [
    { path: '', component: MenuComponent },    { path: 'menucreate/:_id ', component: MenucreateComponent },
    { path: 'menucreate', component: MenucreateComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MenuRoutingModule {
}
