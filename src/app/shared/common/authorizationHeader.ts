import { Headers, RequestOptions } from '@angular/http';
import { Constants } from '../constants';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationHeader {

  constructor(private constants: Constants) { }

  public getAuthHeader() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    if (localStorage.getItem('key-basedata') === undefined ||
      localStorage.getItem('key-basedata') === null ||
      localStorage.getItem('key-basedata') === '') {
      headers.append('key-basedata', this.constants.defaultdatabase);
    } else {
      headers.append('key-basedata', localStorage.getItem('key-basedata'));
    }
    console.log(headers);
    const options = new RequestOptions({ headers: headers });
    return options;
  }
}
