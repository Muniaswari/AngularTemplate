import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import 'rxjs';
import { Config } from "./app/app.config";

if (environment.production) {
  enableProdMode();
}
Config.loadInstance('./assets/appconfig/appconfig.json')
  .then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
      // Ensure Angular destroys itself on hot reloads.
      if (window['ngRef']) {
        window['ngRef'].destroy();
      }
      window['ngRef'] = ref;

      // Otherise, log the boot error
    }).catch(err => console.error(err));
  });
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));
