import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CookieModule } from 'ngx-cookie';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth';
import { MaterialModule } from '@pulp-fiction/material';
import { IconsModule } from '@pulp-fiction/icons';
import { HomeComponent } from './pages/home/home.component';
import { QueueComponent } from './pages/queue/queue.component';
import { AuditComponent } from './pages/audit/audit.component';
import { DocsComponent, CreateDocComponent, EditDocComponent } from './pages/docs';
import { NewsComponent } from './pages/news/news.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';
import { PostFormComponent } from './pages/news/post-form/post-form.component';
import { NewEditorComponent } from './components/new-editor';

import * as pipes from './pipes';
import { EditNewsPostResolver } from './resolvers';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, QueueComponent, AuditComponent,
    DocsComponent, NewsComponent, ReportsComponent, UsersComponent,
    PostFormComponent, NewEditorComponent, pipes.AbbreviateNumbersPipe, pipes.FixCategoriesPipe,
    pipes.PluralizePipe, pipes.SafeHtmlPipe, pipes.SeparateEntitiesPipe, pipes.SlugifyPipe,
    pipes.StringifyMetaPipe, pipes.ToLocaleStringPipe, pipes.TruncatePipe, CreateDocComponent,
    EditDocComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, IconsModule, CKEditorModule,
    NgxPaginationModule,
    CookieModule.forRoot()
  ],
  providers: [
    EditNewsPostResolver,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }