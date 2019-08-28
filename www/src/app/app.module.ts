import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { InfoComponent } from './info/info.component';
import { FooterComponent } from './footer/footer.component';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule, } from 'ngx-google-analytics';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    NgxGoogleAnalyticsModule.forRoot('UA-145642450-1'),
    NgxGoogleAnalyticsRouterModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
