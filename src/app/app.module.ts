import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from "./login/login.page";
import { ClientVisitPage } from './seller/client-visit/client-visit.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePage } from './seller/home/home.page';
import { HomePageClient } from './client/home/home-client.page';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, LoginPage, ClientVisitPage, HttpClientModule, HomePage,HomePageClient],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
