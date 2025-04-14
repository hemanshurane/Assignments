import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimeNG, providePrimeNG } from 'primeng/config';
import { ButtonModule } from 'primeng/button';
import Aura from '@primeng/themes/aura';
import { HttpClientModule } from '@angular/common/http';
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
})],
  bootstrap: [AppComponent]
})
export class AppModule { }
