import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MenucreateComponent, MenuTreeComponent
} from './components';
//import { StatModule } from '../../shared';
import { PageHeaderModule, ValidationSummaryModule } from '../../shared';
@NgModule({
    imports: [TranslateModule,
        CommonModule, FormsModule,
        ReactiveFormsModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbModule.forRoot(),
        ValidationSummaryModule,
        PageHeaderModule,
        MenuRoutingModule
        //StatModule
    ],
    exports: [
        TranslateModule
    ],
    declarations: [
        MenuComponent,
        MenucreateComponent,
        MenuTreeComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuModule { }
