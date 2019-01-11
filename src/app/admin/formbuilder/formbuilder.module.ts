import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilderRoutingModule } from './formbuilder-routing.module';
import { FormBuilderComponent } from './formbuilder.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    TableDesignComponent, FormDesignComponent
} from './components';
import { StatModule,SearchModule, PageHeaderModule, ValidationSummaryModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        FormBuilderRoutingModule,
        StatModule,
        SearchModule,
         ValidationSummaryModule,          
        PageHeaderModule
    ],
    exports: [
        TranslateModule
    ],
    declarations: [
        FormBuilderComponent,
        TableDesignComponent, 
        FormDesignComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormBuilderModule { }
