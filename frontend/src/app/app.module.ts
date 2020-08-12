import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToppyModule } from 'toppy';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import * as QuillNamespace from 'quill';
import * as MagicUrl from 'quill-magic-url';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SlugifyPipe, PluralizePipe, SeparateEntitiesPipe, FixCategoriesPipe,
  StringifyMetaPipe, ToLocaleStringPipe } from './pipes';
import { IconsModule, AlertsModule } from './modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './services/auth';

import { HomeComponent, LatestComponent, WatchingComponent, CollectionsComponent, HistoryComponent,
  BlogsComponent, WorksComponent, InboxComponent, SettingsComponent, AlertsComponent } from './pages/home';

import { PortfolioComponent, PortHomeComponent, PortBlogComponent, PortWorksComponent,
    PortCollectionsComponent, PortBlogPageComponent } from './pages/portfolio';

import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
import { RegisterComponent } from './pages/account';
import { WorkPageComponent, SectionPageComponent, NewSectionComponent,
  UnpublishedSectionPageComponent } from './pages/work-page';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';

import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';
import { CreateBlogComponent, PreviewBlogComponent, EditBlogComponent } from './components/modals/blogs';
import { NewWorkComponent, EditWorkComponent, UploadCoverartComponent } from './components/modals/works';
import { UploadAvatarComponent } from './components/modals/account';
import { BeatrizHeroComponent } from './components/beatriz-hero/beatriz-hero.component';
import { DashboardComponent, ApprovalQueueComponent, NewsManagementComponent, DocsComponent, ReportsComponent,
  UsersComponent, AuditComponent, OverviewComponent } from './pages/dashboard';

import { Divider, dividerHandler } from './util/quill';
import { NetworkInputComponent } from './components/network-input/network-input.component';

const Quill: any = QuillNamespace;
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
icons.ordered = '<i class="fas fa-list-ol"></i>';
icons.bullet = '<i class="fas fa-list"></i>';
icons.divider = '—';

Quill.register('modules/magicUrl', MagicUrlModule);
Quill.register(Divider);

const toolbarOptions = [
  [{header: []}, 'bold', 'italic', 'underline', 'strike'],
  ['divider', 'link', 'blockquote', 'code', 'clean'],
  [{align: 'center'}, {align: 'right'}, {align: 'justify'}],
  [{list: 'ordered'}, {list: 'bullet'}],
];

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent, GroupsComponent,
    NewsComponent, RegisterComponent, LatestComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, InboxComponent, SettingsComponent, UserMenuComponent,
    SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, HistoryComponent, EditBlogComponent,
    PortfolioComponent, PortHomeComponent, PortBlogComponent, PortWorksComponent, PortCollectionsComponent,
    PortBlogPageComponent, NewWorkComponent, EditWorkComponent, WorkPageComponent, SectionPageComponent,
    UnpublishedSectionPageComponent, SeparateEntitiesPipe, FixCategoriesPipe, NewSectionComponent, UploadAvatarComponent,
    ApprovalQueueComponent, DashboardComponent, BeatrizHeroComponent, ReportsComponent, UsersComponent, AuditComponent,
    NewsManagementComponent, DocsComponent, UploadCoverartComponent, SearchComponent, FindUsersComponent,
    FindWorksComponent, FindBlogsComponent, StringifyMetaPipe, ToLocaleStringPipe, NetworkInputComponent, AlertsComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, ToppyModule,
    IconsModule, AlertsModule, FileUploadModule, NgSelectModule, ImageCropperModule,
    QuillModule.forRoot({
      format: 'json',
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            'divider': dividerHandler,
          }
        },
      },
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    SlugifyPipe
  ],
  entryComponents: [
    UserMenuComponent, SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, EditBlogComponent,
    NewWorkComponent, EditWorkComponent, UploadAvatarComponent, UploadCoverartComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
