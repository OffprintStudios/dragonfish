import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth';
import { MaterialModule } from '@pulp-fiction/material';
import { QuillModule } from 'ngx-quill';
import * as QuillNamespace from 'quill';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieModule } from 'ngx-cookie';
import { Ng2FittextModule } from 'ng2-fittext';
import { IconsModule } from '@pulp-fiction/icons';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MarkdownModule } from 'ngx-markdown';
import { NguCarouselModule } from '@ngu/carousel';

import { SlugifyPipe, PluralizePipe, SeparateGenresPipe, FixCategoriesPipe,
  StringifyMetaPipe, ToLocaleStringPipe, AbbreviateNumbersPipe, SafeHtmlPipe, 
  TruncatePipe, LocaleDatePipe, JoinStringsPipe } from './pipes';
import { AlertsModule, NagBarModule } from './modules';
import { Divider, dividerHandler, TextSoftBreakBlot, shiftEnterHandler, 
  brMatcher, textNodeMatcher } from './util/quill';

import { HomeComponent, NewsComponent, WatchingPageComponent } from './pages/home';

import { PortfolioComponent, PortHomeComponent, PortBlogPageComponent, WorksComponent, SettingsComponent,
  BlogsComponent, CollectionsComponent, NotificationsComponent as PortNotifications, ConversationsComponent as PortConversations,
  HistoryComponent as HistoryPageComponent } from './pages/portfolio';
import { CollectionPageComponent } from './pages/portfolio/collections';

import { MyStuffComponent, BlogFormComponent, ContentItemComponent, PoetryFormComponent, ProseFormComponent,
  ViewPoetryComponent, ViewProseComponent, SectionItemComponent } from './pages/my-stuff';

import { BrowseComponent, SocialComponent, PostPageComponent } from './pages';
import { RegisterComponent } from './pages/account';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';
import { ProsePageComponent, PoetryPageComponent, SectionViewComponent } from './pages/content-views';
import { DashComponent, OverviewComponent, ApprovalQueueComponent, GroupQueueComponent, NewsManagementComponent,
  ReportsComponent, UsersManagementComponent, AuditLogComponent } from './pages/dash';
import { PostFormComponent } from './pages/dash/news-management';
import { TosComponent, CodeOfConductComponent, OmnibusComponent, AboutOffprintComponent, SiteStaffComponent, SupportersComponent } from './pages/docs';

import { UploadCoverartComponent } from './components/modals/works';
import { UploadAvatarComponent } from './components/modals/account';
import { BeatrizHeroComponent } from './components/beatriz-hero/beatriz-hero.component';
import { CreateCollectionComponent, AddToCollectionComponent } from './components/modals/collections';
import { CommentsComponent } from './components/comments';
import { EditorComponent } from './components/editor';
import { WorkCardComponent } from './components/work-card/work-card.component';
import { RatingIconComponent } from './components/rating-icon/rating-icon.component';
import { RoleBadgeComponent } from './components/role-badge/role-badge.component';
import { UserCardComponent } from './components/user-card/user-card.component';

import { NetworkInputComponent } from './components/network-input/network-input.component';
import { NewPolicyNagComponent } from './components/new-policy-nag/new-policy-nag.component';

import { NewEditorComponent } from './components/new-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SiteSidenavComponent, ConversationsComponent, NotificationsComponent, WatchingComponent,
  HistoryComponent } from './components/site-sidenav';
import { StartConversationComponent } from './components/modals/portfolio/start-conversation/start-conversation.component';
import { ContentApprovalComponent } from './components/content-approval';

import { MigrationComponent, MigrateWorkComponent, MigrateBlogComponent } from './pages/migration';

const Quill: any = QuillNamespace;
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

Quill.register(Divider);
Quill.register('blots/text', TextSoftBreakBlot);

const toolbarOptions = [
  [{header: []}, 'bold', 'italic', 'underline', 'strike'],
  ['divider', 'link', 'blockquote', 'code', 'clean'],
  [{align: 'center'}, {align: 'right'}, {align: 'justify'}],
  [{list: 'ordered'}, {list: 'bullet'}],
];

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent,
    NewsComponent, RegisterComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, SettingsComponent, HistoryPageComponent, PortfolioComponent, PortHomeComponent, PortBlogPageComponent, 
    SeparateGenresPipe, JoinStringsPipe, FixCategoriesPipe, UploadAvatarComponent, 
    BeatrizHeroComponent, UploadCoverartComponent, SearchComponent, FindUsersComponent,
    FindWorksComponent, FindBlogsComponent, StringifyMetaPipe, ToLocaleStringPipe, NetworkInputComponent,
    SiteStaffComponent, CreateCollectionComponent, SocialComponent,
    AddToCollectionComponent, AbbreviateNumbersPipe, NewPolicyNagComponent, CommentsComponent,
    EditorComponent, NewEditorComponent, SafeHtmlPipe, SiteSidenavComponent, ConversationsComponent,
    NotificationsComponent, WatchingPageComponent, HistoryComponent, StartConversationComponent, TruncatePipe,
    PostPageComponent, PortNotifications, PortConversations, MyStuffComponent, BlogFormComponent, 
    ContentItemComponent, ProseFormComponent, PoetryFormComponent, ViewProseComponent, RatingIconComponent, ViewPoetryComponent,
    SectionItemComponent, WorkCardComponent, ProsePageComponent, PoetryPageComponent, SectionViewComponent, LocaleDatePipe,
    MigrationComponent, MigrateWorkComponent, MigrateBlogComponent, ContentApprovalComponent, CollectionPageComponent,
    DashComponent, OverviewComponent, ApprovalQueueComponent, GroupQueueComponent, NewsManagementComponent, 
    ReportsComponent, UsersManagementComponent, AuditLogComponent, PostFormComponent, TosComponent, CodeOfConductComponent, OmnibusComponent, 
    AboutOffprintComponent, RoleBadgeComponent, UserCardComponent, SupportersComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, IconsModule, 
    AlertsModule, FileUploadModule, ImageCropperModule, NgxPaginationModule,
    NagBarModule, BrowserAnimationsModule, CKEditorModule, MaterialModule, Ng2FittextModule,
    LoadingBarModule, LoadingBarHttpClientModule, ClipboardModule, NguCarouselModule,
    MarkdownModule.forRoot(),
    CookieModule.forRoot(),
    QuillModule.forRoot({
      format: 'json',
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            'divider': dividerHandler,            
          }
        },
        keyboard: {
          bindings: {
            "shift enter": {
              key: 13,
              shiftKey: true,
              handler: shiftEnterHandler
            }
          }
        },
        clipboard: {
          matchers: [           
            [ Node.TEXT_NODE, textNodeMatcher ],
            [ "BR", brMatcher ]
          ],          
        }
      },
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    SlugifyPipe
  ],
  entryComponents: [
    UploadAvatarComponent, UploadCoverartComponent, AddToCollectionComponent, StartConversationComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
