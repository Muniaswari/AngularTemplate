import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Response, Headers, RequestOptions, URLSearchParams, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { InterceptorService } from 'ng2-interceptors';
import {
  Router, Route,
  Event as NavigationEvent,
  CanActivate, CanActivateChild, CanLoad,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { Constants } from '../constants';
import { UserPermissionsService } from '../services/userpermissions.service';

@Injectable()
export class AuthService implements CanActivate, CanActivateChild, CanLoad {

  private configObj = { 'authEndpoint': '', 'clientId': '', 'redirectURI': '' };
  private code: string;
  private cachedURL: string;
  private loginProvider: string;
  private loading: boolean;
  private loginURI: string;
  constructor(private _http: InterceptorService,
    private _dataService: UserPermissionsService,
    private router: Router, private location: Location,
    private constants: Constants) {
    const config = localStorage.getItem('authConfig');
    const provider = localStorage.getItem('provider');
    const cachedURL = localStorage.getItem('cachedurl');
    const params = new URLSearchParams(this.location.path(false).split('?')[1]);
    this.code = params.get('code');

    if (config) {
      this.configObj = JSON.parse(config)[provider];
      this.loginURI = JSON.parse(config).loginRoute;
    }
    if (provider) {
      this.loginProvider = provider;
    }
    if (cachedURL) {
      this.cachedURL = cachedURL;
    }
    if (this.code) {
      this.login(this.code, this.configObj.clientId, this.configObj.redirectURI, this.configObj.authEndpoint)
        .then((data: any) => {
          this.loading = false;
          //  this.router.navigate([this.cachedURL]);
          return true;
        });
    }
  }
  // https://blogs.msdn.microsoft.com/premier_developer/2018/03/07/angular-how-to-implement-role-based-security/
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    // console.log();
    return this.verifyLogin(url);
  }

  // https://stackoverflow.com/questions/49015284/clear-local-storage-when-the-browser-closes-in-angular
  checkReadPermissions(form, permission) {
    console.log(form);
    console.log(permission.FormPermissions.Add); console.log(permission.FormPermissions.Edit);
    if (permission.FormPermissions !== undefined && permission.FormPermissions !== null &&
      (permission.FormPermissions.Add === true || permission.FormPermissions.Edit === true)) {
      console.log('user permiss');
      return false; // true : form get disable  , false : form get enabled;
    } else {
      return true;
      // this._dataService.checkFormPermission(        localStorage.getItem('CurLoggedUser'))
      //    .subscribe(data => {
      //    console.log(data);
      // this.permissionInfo = data;
      // });

    }

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    return this.verifyLogin(url);
  }
  // Function to register user accounts
  registerUser(user) {
    return this._http.post(this.constants.authapi + '/signup', user).map(res => res.json())
      .catch(this.handleError);
  }

  // Function to login user
  loginwithUser(user) {
    return this._http.post(this.constants.authapi + '/login', user)
      .map(res => res.json())
      .catch(this.handleError);
  }

 // Function to check if e-mail is taken
  checkEmailAdmin(email) {
    return this._http.get(this.constants.authapi + '/checkEmailAdmin/' + email).map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this._http.get(this.constants.authapi + '/checkEmail/' + email).map(res => res.json());
  }

  login(code: any, clientId: any, redirectURI: any, authEndpoint: any): Promise<any> {

    const body = { 'code': code, 'clientId': clientId, 'redirectUri': redirectURI }

    return this._http.post(authEndpoint, body, {})
      .toPromise()
      .then((r: Response) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', r.json().token);
        return r.json()
      })
      .catch(this.handleError);
    // return Observable.of(true).delay(1000).do(val => this.isLoggedIn = localStorage.getItem('isLoggedIn'));
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  logout(): void {
    localStorage.removeItem('key-basedata');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('CurLoggedUser');
    localStorage.removeItem('cachedurl');
    localStorage.removeItem('provider');
    this.router.navigate(['/login']);
  }

  verifyLogin(url): boolean {
    // if (localStorage.getItem('token') === null)
    // this.router.navigate(['/login']);
    if (!this.isLoggedIn() && this.code == null || localStorage.getItem('token') === null) {
      localStorage.setItem('cachedurl', url);
      this.router.navigate(['/login']);
      return false;
    } else if (this.isLoggedIn()) {
      return true;
    } else if (!this.isLoggedIn() && this.code != null) {
      const params = new URLSearchParams(this.location.path(false).split('?')[1]);
      if (params.get('code') && (localStorage.getItem('cachedurl') === '' || localStorage.getItem('cachedurl') === undefined)) {
        localStorage.setItem('cachedurl', this.location.path(false).split('?')[0]);
      }
      if (this.cachedURL != null || this.cachedURL !== '') {
        this.cachedURL = localStorage.getItem('cachedurl');
      }
    }
  }

  private isLoggedIn(): boolean {
    let status = false;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      status = true;
    } else {
      status = false;
    }
    return status;
  }
  // Function to register user accounts
  adminregisterUser(user) {
    return this._http.post(this.constants.authapi + '/adminsignup', user).map(res => res.json())
      .catch(this.handleError);
  }
  // Function to login user
  adminlogin(user) {
    return this._http.post(this.constants.authapi + '/adminlogin', user)
      .map(res => res.json())
      .catch(this.handleError);
  }

  public auth(provider: string, authConfig: any): void {

    localStorage.setItem('authConfig', JSON.stringify(authConfig));
    localStorage.setItem('provider', provider);

    if (provider === 'linkedin' && !this.isLoggedIn()) {
      window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?client_id=' +
        authConfig.linkedin.clientId + '&redirect_uri=' + authConfig.linkedin.redirectURI +
        '&response_type=code';
    } else if (provider === 'facebook' && !this.isLoggedIn()) {
      window.location.href = 'https://www.facebook.com/v2.8/dialog/oauth?client_id=' +
        authConfig.facebook.clientId + '&redirect_uri=' +
        authConfig.facebook.redirectURI + '&scope=email';
    } else if (provider === 'google' && !this.isLoggedIn()) {
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=' +
        authConfig.google.clientId + '&redirect_uri=' + authConfig.google.redirectURI +
        '&scope=email%20profile';
    } else {
      this.router.navigate([this.cachedURL]);
    }
  }

}
