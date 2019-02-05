import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './shared/guard/auth.service';
import { AdminAuthService } from './shared/guard/adminauth.service';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthService] },
  { path: 'adminLayout', loadChildren: './admin/admin.module#AdminModule', canActivate: [AdminAuthService] },
  { path: 'login', loadChildren: './login/login.module#LoginModule'},
  { path: 'home', component: HomeComponent },
  { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
  { path: 'adminlogin', loadChildren: './adminlogin/adminlogin.module#AdminLoginModule' },
  { path: 'adminsignup', loadChildren: './adminsignup/adminsignup.module#AdminSignupModule' },
  { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
  { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' }  ,
  { path: 'pricing', loadChildren: './layout/pricing/pricing.module#PricingModule' },
  { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
