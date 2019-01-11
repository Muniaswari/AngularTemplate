import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ValidationSummaryComponent } from './validation-summary.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [ValidationSummaryComponent],
    exports: [ValidationSummaryComponent]
})
export class ValidationSummaryModule {}
