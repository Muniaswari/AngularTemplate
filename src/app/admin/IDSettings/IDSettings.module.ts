import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { IDSettingsRoutingModule } from './IDSettings-routing.module';
import { IDSettingsListComponent } from './IDSettingsList.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    IDSettingsComponent
} from './components';
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
        IDSettingsRoutingModule
    ],
    exports: [
        TranslateModule
    ],
    declarations: [
        IDSettingsListComponent,
        IDSettingsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IDSettingsModule { }
