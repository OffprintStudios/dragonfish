import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';

import { AuthState } from './shared/auth';
import { AuthInterceptor } from './shared/auth/services';
import { GlobalState } from './shared/global';
import { UserState } from './shared/user';
import { ApprovalQueueState } from './shared/dash/approval-queue';
import { ContentState } from './shared/content';
import { MyStuffState } from './shared/my-stuff';
import { AlertsState, AlertsComponent } from './shared/alerts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '@pulp-fiction/material';
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
import { NagBarModule } from './modules';

import { HomeComponent, NewsComponent, WatchingPageComponent } from './pages/home';

import { BrowseComponent } from './pages/browse';

import { PortfolioComponent, PortHomeComponent, BlogPageComponent, WorksComponent, SettingsComponent,
  BlogsComponent, CollectionsComponent, ConversationsComponent as PortConversations,
  HistoryComponent as HistoryPageComponent } from './pages/portfolio';
import { CollectionPageComponent } from './pages/portfolio/collections';

import { MyStuffComponent, BlogFormComponent, ContentItemComponent, PoetryFormComponent, ProseFormComponent,
  ViewPoetryComponent, ViewProseComponent, SectionItemComponent, NewsFormComponent } from './pages/my-stuff';

import { SocialComponent } from './pages';
import { RegisterComponent } from './pages/account';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';
import { ProsePageComponent, PoetryPageComponent, PostPageComponent, SectionViewComponent } from './pages/content-views';
import { DashComponent, OverviewComponent, ApprovalQueueComponent, GroupQueueComponent, NewsManagementComponent,
  ReportsComponent, UsersManagementComponent, AuditLogComponent } from './pages/dash';
import { ApprovePoetryComponent, ApproveProseComponent, ApproveSectionViewComponent } from './pages/dash/approval-queue';

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

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SiteSidenavComponent, ConversationsComponent, NotificationsComponent, WatchingComponent,
  HistoryComponent } from './components/site-sidenav';
import { NotifItemComponent } from './components/site-sidenav/notifications/notif-item/notif-item.component';
import { StartConversationComponent } from './components/modals/portfolio/start-conversation/start-conversation.component';
import { ContentApprovalComponent } from './components/content-approval';

import { MigrationComponent, MigrateWorkComponent, MigrateBlogComponent } from './pages/migration';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { environment } from '../environments/environment';
import { SectionsState } from './shared/my-stuff/sections';

@NgModule({
  declarations: [
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent,
    NewsComponent, RegisterComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, SettingsComponent, HistoryPageComponent, PortfolioComponent, PortHomeComponent, BlogPageComponent, 
    SeparateGenresPipe, JoinStringsPipe, FixCategoriesPipe, UploadAvatarComponent, 
    BeatrizHeroComponent, UploadCoverartComponent, SearchComponent, FindUsersComponent,
    FindWorksComponent, FindBlogsComponent, StringifyMetaPipe, ToLocaleStringPipe, NetworkInputComponent,
    SiteStaffComponent, CreateCollectionComponent, SocialComponent,
    AddToCollectionComponent, AbbreviateNumbersPipe, NewPolicyNagComponent, CommentsComponent,
    EditorComponent, SafeHtmlPipe, SiteSidenavComponent, ConversationsComponent,
    NotificationsComponent, WatchingPageComponent, HistoryComponent, StartConversationComponent, TruncatePipe,
    PostPageComponent, PortConversations, MyStuffComponent, BlogFormComponent, 
    ContentItemComponent, ProseFormComponent, PoetryFormComponent, ViewProseComponent, RatingIconComponent, ViewPoetryComponent,
    SectionItemComponent, WorkCardComponent, ProsePageComponent, PoetryPageComponent, SectionViewComponent, LocaleDatePipe,
    MigrationComponent, MigrateWorkComponent, MigrateBlogComponent, ContentApprovalComponent, CollectionPageComponent,
    DashComponent, OverviewComponent, ApprovalQueueComponent, GroupQueueComponent, NewsManagementComponent, 
    ReportsComponent, UsersManagementComponent, AuditLogComponent, PostFormComponent, TosComponent, CodeOfConductComponent, OmnibusComponent, 
    AboutOffprintComponent, RoleBadgeComponent, UserCardComponent, SupportersComponent, NotifItemComponent, ApprovePoetryComponent,
    ApproveProseComponent, ApproveSectionViewComponent, AlertsComponent, NewsFormComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, IconsModule, 
    FileUploadModule, ImageCropperModule, NgxPaginationModule,
    NagBarModule, BrowserAnimationsModule, CKEditorModule, MaterialModule, Ng2FittextModule,
    LoadingBarModule, LoadingBarHttpClientModule, ClipboardModule, NguCarouselModule,
    NgxsModule.forRoot([
      AuthState, GlobalState, UserState, ApprovalQueueState, ContentState, MyStuffState, AlertsState, SectionsState
    ], {developmentMode: !environment.production, selectorOptions: {suppressErrors: false, injectContainerState: false}}),
    NgxsStoragePluginModule.forRoot({
      key: [
        'auth', 'user', 'global', 'myStuff.currContent', 'myStuff.sections.currSection', 'approvalQueue.selectedDoc', 
        'approvalQueue.selectedDocSections', 'approvalQueue.selectedDocSection'
      ]
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(), NgxsRouterPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(), MarkdownModule.forRoot(), CookieModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({disabled: environment.production}), NgxsSelectSnapshotModule.forRoot()
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
