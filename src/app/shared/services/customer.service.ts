import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class CustomerService {

    constructor(private _http: Http, private contant: Constants, private authorizationHeader: AuthorizationHeader) { }

    get(): Observable<any> {
        const api: string = [this.contant.customerapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    getById(id: string): Observable<any> {
        const api: string = [this.contant.customerapi, 'findById', id].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
   }

   findCountry(){
       const api: string = [this.contant.customerapi, 'findCountry'].join('/');
       return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
           .catch(this.handleError);
   }

    // public getLists(): Observable<any> {
    //     var api: string = [this.contant.customerapi, 'GetUsers'].join('/');
    //     var queryString: string = [
    //         'pageNumber=' + 1,
    //         'pageSize=' + 10
    //    ].join('&');

    //     var url = api + '?' + queryString;

    //     return this._http.get(url)
    //         .map((response: Response) => <any>response.json())
    //         .do(data => console.log('All: ' + JSON.stringify(data)))
    //         .catch(this.handleError);
    // }
    // public getUsers(pageNumber: number, pageSize: number, salesOrderNumber: string, customerName: string): Observable<any> {
    //     var api: string = [this.contant.customerapi, 'GetUsers'].join('/');
    //     var queryString: string = [
    //         'pageNumber=' + (pageNumber ? pageNumber : 1),
    //         'pageSize=' + (pageSize ? pageSize : 10),
    //         // "searchColumn=" + (salesOrderNumber ? salesOrderNumber : ""),
    //         //"searchValue=" + (customerName ? customerName : "")
    //     ].join('&');

    //     var url = api + '?' + queryString;
    //     console.log(url);

    //     return this._http.get(url)
    //         // .map((response: Response) => <any>response.json())
    //         .do(data => console.log('All: ' + JSON.stringify(data)))
    //         .catch(this.handleError);
    // }


    save( model: any): Observable<any> {
        const body = JSON.stringify(model);

        return this._http.post(this.contant.customerapi + '/save', body, 
         this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            //  .do(data => console.log("All: " + data))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    update(id: any, model: any): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let api: string = [this.contant.customerapi, 'update', id].join('/');
        console.log(api);
        const body = JSON.stringify(model);
        return this._http.put(api, body, this.authorizationHeader.getAuthHeader())
           .map((response: Response) => <any>response.json())
           .catch(this.handleError);
    }

    delete(id: number): Observable<any> {
        const api: string = [this.contant.customerapi, 'delete', id].join('/');
        console.log(api);
        return this._http.delete(api, this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}