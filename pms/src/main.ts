import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppModule } from './app/app.module';

platformBrowserDynamic([
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]).bootstrapModule(AppModule)
  .catch(err => console.error(err));