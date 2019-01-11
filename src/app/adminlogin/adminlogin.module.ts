import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLoginRoutingModule } from './adminlogin-routing.module';
import { AdminLoginComponent } from './adminlogin.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule, AdminLoginRoutingModule],
    declarations: [AdminLoginComponent]
})
export class AdminLoginModule {}
