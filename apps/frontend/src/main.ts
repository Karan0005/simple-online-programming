/* eslint-disable no-console */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CONFIG } from './config/config';
import { AppModule } from './modules/app.module';

// setting up production mode
if (CONFIG.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
