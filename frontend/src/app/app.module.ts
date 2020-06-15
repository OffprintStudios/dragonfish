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

import { HomeComponent, LatestComponent, WatchingComponent, CollectionsComponent, BlogsComponent,
  WorksComponent, InboxComponent, SettingsComponent } from './pages/home';

import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
import { RegisterComponent } from './pages/account';

import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent, GroupsComponent,
    NewsComponent, RegisterComponent, LatestComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, InboxComponent, SettingsComponent, UserMenuComponent, SearchMenuComponent,
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
