import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth';
import { MaterialModule } from '@pulp-fiction/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import * as QuillNamespace from 'quill';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieModule } from 'ngx-cookie';
import { Ng2FittextModule } from 'ng2-fittext';
import { IconsModule } from '@pulp-fiction/icons';

import { SlugifyPipe, PluralizePipe, SeparateEntitiesPipe, FixCategoriesPipe,
  StringifyMetaPipe, ToLocaleStringPipe, AbbreviateNumbersPipe, SafeHtmlPipe, TruncatePipe } from './pipes';
import { AlertsModule, NagBarModule } from './modules';
import { Divider, dividerHandler, TextSoftBreakBlot, shiftEnterHandler, brMatcher, textNodeMatcher } from './util/quill';

import { HomeComponent, LatestComponent, WatchingPageComponent } from './pages/home';

import { PortfolioComponent, PortHomeComponent, PortBlogPageComponent, PortCollectionPageComponent, WorksComponent, SettingsComponent,
  BlogsComponent, CollectionsComponent, NotificationsComponent as PortNotifications, ConversationsComponent as PortConversations,
  HistoryComponent as HistoryPageComponent, MyStuffComponent } from './pages/portfolio';

import { BrowseComponent, GroupsComponent, NewsComponent, PostPageComponent } from './pages';
import { RegisterComponent } from './pages/account';
import { WorkPageComponent, SectionPageComponent, NewSectionComponent } from './pages/work-page';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';

import { DocsPageComponent, SiteStaffComponent } from './pages/docs-page';

import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';
import { WorkFormComponent } from './components/content-forms';
import { CreateBlogComponent, PreviewBlogComponent, EditBlogComponent } from './components/modals/blogs';
import { NewWorkComponent, EditWorkComponent, UploadCoverartComponent } from './components/modals/works';
import { UploadAvatarComponent } from './components/modals/account';
import { BeatrizHeroComponent } from './components/beatriz-hero/beatriz-hero.component';
import { CreateCollectionComponent, AddToCollectionComponent } from './components/modals/collections';
import { CommentsComponent } from './components/comments';
import { EditorComponent } from './components/editor';

import { NetworkInputComponent } from './components/network-input/network-input.component';
import { NewPolicyNagComponent } from './components/new-policy-nag/new-policy-nag.component';

import { NewEditorComponent } from './components/new-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SiteSidenavComponent, ConversationsComponent, NotificationsComponent, WatchingComponent,
  HistoryComponent } from './components/site-sidenav';
import { StartConversationComponent } from './components/portfolio/start-conversation/start-conversation.component';
import { BlogFormComponent } from './pages/portfolio/my-stuff/blog-form/blog-form.component';
import { NewFolderComponent } from './pages/portfolio/my-stuff/new-folder/new-folder.component';

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
    AppComponent, SlugifyPipe, PluralizePipe, HomeComponent, BrowseComponent, GroupsComponent,
    NewsComponent, RegisterComponent, LatestComponent, CollectionsComponent, WatchingComponent,
    BlogsComponent, WorksComponent, SettingsComponent, UserMenuComponent,
    SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, HistoryPageComponent, EditBlogComponent,
    PortfolioComponent, PortHomeComponent, PortBlogPageComponent, NewWorkComponent, EditWorkComponent, WorkPageComponent, 
    SectionPageComponent, SeparateEntitiesPipe, FixCategoriesPipe, NewSectionComponent, UploadAvatarComponent, 
    BeatrizHeroComponent, UploadCoverartComponent, SearchComponent, FindUsersComponent,
    FindWorksComponent, FindBlogsComponent, StringifyMetaPipe, ToLocaleStringPipe, NetworkInputComponent,
    DocsPageComponent, SiteStaffComponent, CreateCollectionComponent,
    AddToCollectionComponent, AbbreviateNumbersPipe, PortCollectionPageComponent, NewPolicyNagComponent, CommentsComponent,
    EditorComponent, NewEditorComponent, SafeHtmlPipe, SiteSidenavComponent, ConversationsComponent,
    NotificationsComponent, WatchingPageComponent, HistoryComponent, StartConversationComponent, TruncatePipe,
    WorkFormComponent, PostPageComponent, PortNotifications, PortConversations, MyStuffComponent, BlogFormComponent, NewFolderComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, IconsModule, 
    AlertsModule, FileUploadModule, NgSelectModule, ImageCropperModule, NgxPaginationModule,
    NagBarModule, BrowserAnimationsModule, CKEditorModule, MaterialModule, Ng2FittextModule,
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
    UserMenuComponent, SearchMenuComponent, CreateBlogComponent, PreviewBlogComponent, EditBlogComponent,
    NewWorkComponent, EditWorkComponent, UploadAvatarComponent, UploadCoverartComponent, CreateBlogComponent,
    AddToCollectionComponent, StartConversationComponent, NewFolderComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
