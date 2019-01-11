import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormBuilderComponent } from './formbuilder.component';
import {
    FormDesignComponent,
    TableDesignComponent
} from './components';
const routes: Routes = [
    { path: '', component: FormBuilderComponent },
    //  { path: 'formdesign/:_id ', component: MenucreateComponent },
    { path: 'formdesign', component: FormDesignComponent },
    { path: 'tabledesign', component: TableDesignComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormBuilderRoutingModule {
}
