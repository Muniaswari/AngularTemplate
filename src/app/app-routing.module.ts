import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { AuthService } from './shared/guard/auth.service';
import { AdminAuthService } from './shared/guard/adminauth.service';

import { LayoutModule } from './layout/layout.module';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { HomeComponent } from './home/home.component';
import { SignupModule } from './signup/signup.module';
import { AdminLoginModule } from './adminlogin/adminlogin.module';
import { AdminSignupModule } from './adminsignup/adminsignup.module';

import { ServerErrorModule } from './server-error/server-error.module';
import { AccessDeniedModule } from './access-denied/access-denied.module';
import { NotFoundModule } from './not-found/not-found.module';
import { PricingModule } from './layout/pricing/pricing.module';

const routes: Routes = [
  { path: '', loadChildren: () => LayoutModule, canActivate: [AuthService] },
  { path: 'adminLayout', loadChildren: () => AdminModule, canActivate: [AdminAuthService] },
  { path: 'login', loadChildren: () => LoginModule },
  { path: 'home', component: HomeComponent },
  { path: 'signup', loadChildren: () => SignupModule },
  { path: 'adminlogin', loadChildren: () => AdminLoginModule },
  { path: 'adminsignup', loadChildren: () => AdminSignupModule },
  { path: 'error', loadChildren: () => ServerErrorModule },
  { path: 'access-denied', loadChildren: () => AccessDeniedModule }
  ,
  { path: 'pricing', loadChildren: () => PricingModule }
 // { path: 'not-found', loadChildren: () => NotFoundModule },
 // { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
