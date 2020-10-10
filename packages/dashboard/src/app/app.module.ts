import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth';
import { MaterialModule } from '@pulp-fiction/material';
import { IconsModule } from '@pulp-fiction/icons';
import { HomeComponent } from './pages/home/home.component';
import { QueueComponent } from './pages/queue/queue.component';
import { AuditComponent } from './pages/audit/audit.component';
import { DocsComponent } from './pages/docs/docs.component';
import { NewsComponent } from './pages/news/news.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';
import { PostFormComponent } from './pages/news/post-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QueueComponent,
    AuditComponent,
    DocsComponent,
    NewsComponent,
    ReportsComponent,
    UsersComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, IconsModule, CKEditorModule,
    CookieModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }