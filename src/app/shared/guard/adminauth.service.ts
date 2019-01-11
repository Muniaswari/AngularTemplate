import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Response, Headers, RequestOptions, URLSearchParams, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { InterceptorService } from 'ng2-interceptors';
import {  Router, Route, NavigationStart,
          Event as NavigationEvent,
          NavigationCancel,
          RoutesRecognized,
          CanActivate, CanActivateChild, CanLoad,
          ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Constants } from '../constants';
@Injectable()
export class AdminAuthService implements CanActivate, CanActivateChild, CanLoad {

  private configObj = {'authEndpoint': '', 'clientId': '', 'redirectURI': ''};
  private code: string;
  private cachedURL: string;
  private loginProvider: string;
  private loading: boolean;
  private loginURI: string;
  constructor(private _http: InterceptorService,
    private router: Router, private location: Location, private constants: Constants) {
    const config = localStorage.getItem('authConfig');
    const provider = localStorage.getItem('provider');
    const cachedURL = localStorage.getItem('cachedurl');
    const params = new URLSearchParams(this.location.path(false).split('?')[1]);
    this.code = params.get('code');

    if (config) {
      this.configObj = JSON.parse(config)[provider];
      this.loginURI =  JSON.parse(config).loginRoute;
    }
    if (provider) {
      this.loginProvider =  provider;
    }
    if (cachedURL) {
      this.cachedURL = cachedURL;
    }
    if (this.code) {
      // this.login(this.code, this.configObj.clientId, this.configObj.redirectURI, this.configObj.authEndpoint)
      // .then((data: any) => {
      //     this.loading = false;
      //   //  this.router.navigate([this.cachedURL]);
      //         return true;
      //     });
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.verifyLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    return this.verifyLogin(url);
  }
  
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('CurLoggedUser');
    localStorage.removeItem('cachedurl');
    localStorage.removeItem('provider'); 
    localStorage.removeItem('key-basedata');
    this.router.navigate(['/adminlogin']);
   
  }

  verifyLogin(url): boolean {
    // if (localStorage.getItem('token') === null)
      // this.router.navigate(['/login']);
    if (!this.isLoggedIn() && this.code == null || localStorage.getItem('token') === null ) {
      localStorage.setItem('cachedurl', url);
      this.router.navigate(['/adminlogin']);
      return false;
    } else if (this.isLoggedIn()) {
      return true;
    } else if (!this.isLoggedIn()  && this.code != null) {
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
    if ( localStorage.getItem('isLoggedIn') === 'true') {
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
