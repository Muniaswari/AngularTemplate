import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class MenuService {
    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    findPage(page: number = 1) {
        const api = [this.contant.menuapi, 'findPageWise', page].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .do(res => console.log(res.json()))
            .catch(this.handleError);
    }

    checkDuplication(menuName, id): Observable<any> {
        return this._http.get([this.contant.menuapi, 'checkDuplication', menuName, id].join('/'),
            this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .catch(this.handleError);
    }

    findAll(): Observable<any> {
        const api: string = [this.contant.menuapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res)
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    findMenus(email): Observable<any> {
        const api: string = [this.contant.menuapi, 'findMenus', email].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res)
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    findData(id): Observable<any> {
        const api: string = [this.contant.menuapi, 'findData', id].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    getById(id: string): Observable<any> {
        return this._http.get([this.contant.menuapi, 'findById', id].join('/'),
            this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    save(model: any): Observable<any> {
        return this._http.post(this.contant.menuapi + '/save',
            JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    update(id: any, model: any): Observable<any> {
        return this._http.put([this.contant.menuapi, 'update', id].join('/'),
            JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(id: any, model: any): Observable<any> {
        const api: string = [this.contant.menuapi, 'delete', id].join('/');
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
