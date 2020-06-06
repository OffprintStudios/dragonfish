import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToppyModule } from 'toppy';
import { SlugifyPipe, PluralizePipe } from './pipes';
import { IconsModule, AlertsModule } from './modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './services/auth';

import { HomeComponent, LatestComponent, SubscriptionsComponent, CollectionsComponent, BlogsComponent,
  WorksComponent, InboxComponent, SettingsComponent } from './pages/home';

import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
import { RegisterComponent } from './pages/account';

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent, GroupsComponent,
    NewsComponent, RegisterComponent, LatestComponent, CollectionsComponent, SubscriptionsComponent,
    BlogsComponent, WorksComponent, InboxComponent, SettingsComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, ToppyModule,
    IconsModule, AlertsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
