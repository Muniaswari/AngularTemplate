import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core'

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuService } from '../shared/services/menu.service';

import { CustomValidatorDirective } from './../shared/common/custom-validator.directive';

@NgModule({
    imports: [
        TranslateModule,
        CommonModule,
        AdminRoutingModule,
        NgbDropdownModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [TranslateModule],
    declarations: [
        AdminComponent,
        SidebarComponent,
        HeaderComponent,
        CustomValidatorDirective
    ],
    providers: [
        MenuService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
