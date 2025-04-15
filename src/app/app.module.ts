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
import { distinctUntilChanged, interval, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

export function initializeApp(appConfigSvc: AppConfigService): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    interval(10000).pipe(
      switchMap(() => appConfigSvc.loadAppConfig()),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe((config) =>  {
      appConfigSvc.setConfig(config);
      resolve();
    },(error) => {
      //errorHandling
      reject(error);
    })
    // appConfigSvc.loadAppConfig().subscribe((config)=> {
    //   appConfigSvc.setConfig(config);
    //   resolve();
    // },(error) => {
    //   //errorHandling
    //   reject(error);
    // })
  })
}

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    HttpClientModule,
    TableModule,
    Dialog,
    BrowserAnimationsModule,
    DynamicDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    BadgeModule,
    OverlayBadgeModule
  ],

  providers: [ providePrimeNG({
    theme: {
        preset: Aura
    }
}), AppConfigService, {provide: APP_INITIALIZER, useFactory: initializeApp, deps:[AppConfigService],multi: true},
{provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
