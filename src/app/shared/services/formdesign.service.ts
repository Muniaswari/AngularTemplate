import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class FormDesignService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    findAll(): Observable<any> {
        const api: string = [this.contant.formdesignapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
        .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    findMaxId(): Observable<any> {
        const api: string = [this.contant.formdesignapi, 'findMaxId'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
          //  .do(res => console.log(res))
            .catch(this.handleError);
    }

    getPage(page: number = 1,  searchField: string, searchValue: any) {
        const api = [this.contant.formdesignapi, 'findPageWise', page,  searchField, searchValue].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .do(res => console.log(res.json()))
            .catch(this.handleError);
    }

    FindById(id: Number): Observable<any> {
        return this._http.get([this.contant.formdesignapi, 'findById', id].join('/'),
            this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    save(model: any): Observable<any> {
        return this._http.post(this.contant.formdesignapi + '/save',
        JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    update(id: any, model: any): Observable<any> {
        return this._http.put([this.contant.formdesignapi, 'update', id].join('/'),
            JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(id: any, model: any): Observable<any> {
        const api: string = [this.contant.formdesignapi, 'delete', id].join('/');
        console.log(api);
        return this._http.put(api, JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }  

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
