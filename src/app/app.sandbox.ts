import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AppSandbox {

  constructor(private translate: TranslateService) { }

  /**
   * Sets up default language for the application. Uses browser default language.
   */
  public setupLanguage(): void {

    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');
  }
}