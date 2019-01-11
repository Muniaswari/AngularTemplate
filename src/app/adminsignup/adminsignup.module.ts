import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminSignupRoutingModule } from './adminsignup-routing.module';
import { AdminSignupComponent } from './adminsignup.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AdminSignupRoutingModule
  ],
  declarations: [AdminSignupComponent]
})
export class AdminSignupModule { }
