import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimeNG, providePrimeNG } from 'primeng/config';
import { ButtonModule } from 'primeng/button';
import Aura from '@primeng/themes/aura';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { AppConfigService } from './services/appConfig.service';
import { AppHttpInterceptor } from './interceptors/http.interceptor';

export function initializeApp(appConfigSvc: AppConfigService): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    appConfigSvc.loadAppConfig().subscribe((config)=> {
      appConfigSvc.setConfig(config);
      resolve();
    },(error) => {
      //errorHandling
      reject(error);
    })
  })
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    HttpClientModule
  ],
  providers: [ providePrimeNG({
    theme: {
        preset: Aura
    }
}), AppConfigService, {provide: APP_INITIALIZER, useFactory: initializeApp, deps:[AppConfigService],multi: true},
{provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
