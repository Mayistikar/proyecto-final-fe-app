import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from "./login/login.page";
import { ClientVisitPage } from './seller/client-visit/client-visit.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HomePage } from './seller/home/home.page';
import { HomePageClient } from './client/home/home-client.page';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LoginPage,
    ClientVisitPage,
    HttpClientModule,
    HomePage,
    HomePageClient,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  // Static property to store TranslateService instance
  private static translateService: TranslateService;

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    AppModule.translateService = translate;
  }

  // Global static translate function accessible from any component
  public static translate(key: string): string {
    return AppModule.translateService.instant(key);
  }
}
