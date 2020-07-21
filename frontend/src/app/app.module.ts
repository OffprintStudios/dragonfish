import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToppyModule } from 'toppy';
import { QuillModule } from 'ngx-quill';
import * as QuillNamespace from 'quill';
import * as MagicUrl from 'quill-magic-url';
import * as MarkdownShortcuts from 'quill-markdown-shortcuts';
import { FileUploadModule } from 'ng2-file-upload';
import { SlugifyPipe, PluralizePipe } from './pipes';
import { IconsModule, AlertsModule } from './modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './services/auth';

import { HomeComponent, LatestComponent, WatchingComponent, CollectionsComponent, HistoryComponent,
  BlogsComponent, WorksComponent, InboxComponent, SettingsComponent } from './pages/home';

import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
import { RegisterComponent } from './pages/account';

import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';
import { CreateBlogComponent, PreviewBlogComponent, EditBlogComponent } from './components/modals';
import { PortfolioComponent, PortHomeComponent, PortBlogComponent, PortWorksComponent,
  PortCollectionsComponent, PortBlogPageComponent } from './pages/portfolio';

const Quill: any = QuillNamespace;
const MDS: any = MarkdownShortcuts;
const MagicUrlModule: any = MagicUrl;
const icons = Quill.import('ui/icons');
icons.bold = '<i class="fas fa-bold"></i>';
icons.italic = '<i class="fas fa-italic"></i>';
icons.underline = '<i class="fas fa-underline"></i>';
icons.strike = '<i class="fas fa-strikethrough"></i>';
icons.link = '<i class="fas fa-link"></i>';
icons.code = '<i class="fas fa-code"></i>';
icons.blockquote = '<i class="fas fa-quote-right"></i>';
icons.clean = '<i class="fas fa-eraser"></i>';
icons.center = '<i class="fas fa-align-center"></i>';
icons.right = '<i class="fas fa-align-right"></i>';
icons.justify = '<i class="fas fa-align-justify"></i>';
icons.video = '<i class="fas fa-video"></i>';
icons.image = '<i class="fas fa-image"></i>';

Quill.register('modules/markdownShortcuts', MDS);
Quill.register('modules/magicUrl', MagicUrlModule);

const toolbarOptions = [
  [{header: []}],
  ['bold', 'italic', 'underline', 'strike'],
  ['link', 'blockquote', 'code', 'clean'],
  [{align: null}, {align: 'center'}, {align: 'right'}, {align: 'justify'}],
  [{header: 2}, {header: 3}],
  [{list: 'ordered'}, {list: 'bullet'}],
  [{color: []}]
];

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent, GroupsComponent,
    NewsComponent, RegisterComponent, LatestComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, InboxComponent, SettingsComponent, UserMenuComponent,
    SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, HistoryComponent, EditBlogComponent,
    PortfolioComponent, PortHomeComponent, PortBlogComponent, PortWorksComponent, PortCollectionsComponent,
    PortBlogPageComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, ToppyModule,
    IconsModule, AlertsModule, FileUploadModule,
    QuillModule.forRoot({
      format: 'json',
      modules: {
        toolbar: {container: toolbarOptions},
      },
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  entryComponents: [
    UserMenuComponent, SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, EditBlogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
