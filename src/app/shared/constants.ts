import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Config } from '../app.config';
@Injectable()
export class Constants {

    //public serverUrl = environment.baseApiUrl;
    public serverUrl = this.config.get("apiurl");
    public redirectURI: string = this.serverUrl + '/admin';

    public defaultdatabase = 'OAuth';

    public communication = this.serverUrl + '/api/communication';
    public facebookClientId = '1414274055348275';
    public facebookEndpoint: string = this.serverUrl + '/auth/facebook';
    public googleClientId = '482714835334-agliofkdslcbnesv33a4hn2gsemci1g2.apps.googleusercontent.com';
    public googleEndpoint: string = this.serverUrl + '/auth/google';
    public linkedinClientId = '8176r44lz2ewos';
    public linkedinEndpoint: string = this.serverUrl + '/auth/linkedin';

    public authapi: string = this.serverUrl + '/auth';
    public customerapi: string = this.serverUrl + '/api/customer';
    public masterapi: string = this.serverUrl + '/api/master';
    public formdesignapi: string = this.serverUrl + '/api/formdesign';
    public menuapi: string = this.serverUrl + '/api/menu';
    public permissionapi: string = this.serverUrl + '/api/permissionapi';
    public roleapi: string = this.serverUrl + '/api/role';
    public userapi: string = this.serverUrl + '/api/user';
    public RecordTotal = 0;
    public formId: string;
    public formPermssions: any;
    constructor(public config:Config) {
    }
}
