import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { FileUploadModule } from 'ng2-file-upload';
import { CookieModule } from 'ngx-cookie';
import { Ng2FittextModule } from 'ng2-fittext';
import { NgxPaginationModule } from 'ngx-pagination';
import { TabsModule } from 'ngx-tabset';
import { MarkdownModule } from 'ngx-markdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { LineTruncationLibModule } from 'ngx-line-truncation';
import { NgxElectronModule } from 'ngx-electron';
import { ClickOutsideModule } from 'ng-click-outside';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';

/* Pages */
import { HomePages } from './pages/home';
import { BrowsePages } from './pages/browse';
import { SocialPages } from './pages/social';
import { DocsPages } from './pages/docs';
import { PortfolioPages } from './pages/portfolio';
import { MessagesPages } from './pages/messages';
import { ContentViewPages } from './pages/content-views';
import { ErrorPages } from './pages/errors';

/* Components */
import { AppComponent } from './app.component';
import { SiteComponents } from './components/site';
import { AuthComponents } from './components/auth';
import { ContentComponents } from './components/content';
import { UserComponents } from './components/user';
import { UserSettingsComponents } from './components/user/settings';
import { CollectionsComponents } from './components/content/collections';
import { FriendsComponents } from './components/user/friends';
import { HistoryComponents } from './components/user/history';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { IconsModule } from '@dragonfish/client/icons';
import { PipesModule } from '@dragonfish/client/pipes';
import { UiModule } from '@dragonfish/client/ui';
import { MaterialModule } from '@dragonfish/client/material';
import { AlertsModule } from '@dragonfish/client/alerts';
import { ClientServicesModule } from '@dragonfish/client/services';
import { CommentsModule } from '@dragonfish/client/comments';

/* Util */
import { environment } from '../environments/environment';
import { AuthInterceptor } from '@dragonfish/client/repository/session/services';

@NgModule({
    declarations: [
        AppComponent,
        ...SiteComponents,
        ...AuthComponents,
        ...ContentComponents,
        ...UserComponents,
        ...UserSettingsComponents,
        ...CollectionsComponents,
        ...FriendsComponents,
        ...HistoryComponents,
        ...HomePages,
        ...BrowsePages,
        ...SocialPages,
        ...DocsPages,
        ...PortfolioPages,
        ...MessagesPages,
        ...ContentViewPages,
        ...ErrorPages,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        FileUploadModule,
        IconsModule,
        PipesModule,
        UiModule,
        MaterialModule,
        AlertsModule,
        CommentsModule,
        ClientServicesModule,
        Ng2FittextModule,
        NgxPaginationModule,
        TabsModule.forRoot(),
        ImageCropperModule,
        NgSelectModule,
        ContentLoaderModule,
        LineTruncationLibModule,
        NgxElectronModule,
        ClickOutsideModule,
        ContextMenuModule,
        CookieModule.forRoot(),
        MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }),
        environment.production ? [] : AkitaNgDevtools.forRoot(),
        AkitaNgRouterStoreModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
        { provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' } },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
