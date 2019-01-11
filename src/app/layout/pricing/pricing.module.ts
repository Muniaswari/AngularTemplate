import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        FormsModule, NgbModule.forRoot(),
        TranslateModule,
        ReactiveFormsModule, PageHeaderModule,
        CommonModule, PricingRoutingModule],
    exports: [
        TranslateModule
    ],
    declarations: [PricingComponent]
})
export class PricingModule {}
