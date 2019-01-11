import { Constants } from '../constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class CommunicationService {

    constructor(private contant: Constants,
        private http: Http) { }

    public sendEmail(emailbody) {
        const model = {
            tomail: 'bflatmunish@gmail.com',
            subject: 'test',
            text: 'hello test is going'
        };
        let url = this.contant.communication + '/sendemail';
        return this.http.post(url, model)
            .map((response: Response) => response.json())
            .toPromise()
            .catch(this.handleError);


    }

    public sendSms(smsbody) {
        let url = this.contant.communication + '/sendSms';
        return this.http.post(url, {
            mobiles: '9962911185',
            message: 'test is going'
        })            .map((response: Response) => response.json())
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}