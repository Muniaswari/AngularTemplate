import { Component, OnInit, HostListener } from '@angular/core';
import { AppSandbox } from './app.sandbox';

import { saveAs } from 'file-saver';
@Component({
  selector: 'app-root',
  template: `
<router-outlet></router-outlet>    `,
  providers: [AppSandbox]
})

export class AppComponent implements OnInit {

  constructor(public appSandbox: AppSandbox) {
  }
  ngOnInit() {

    this.appSandbox.setupLanguage();

    const file = new Blob(['hello world'], { type: "text" } );
    saveAs(file, '/log/munish.txt');
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event) {
    // localStorage.setItem('isLoggedIn', 'false');
    // localStorage.removeItem('token');
    // localStorage.removeItem('CurLoggedUser');
    // localStorage.removeItem('cachedurl');
    // localStorage.removeItem('provider');
    // localStorage.removeItem('key-basedata');
  }
}
