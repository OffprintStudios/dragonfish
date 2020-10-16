import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, LatestComponent, WatchingPageComponent, CollectionsComponent, WorksComponent,
    BlogsComponent, InboxComponent, SettingsComponent, HistoryPageComponent, AlertsComponent } from './pages/home';
  
import { PortfolioComponent, PortHomeComponent, PortBlogComponent, PortBlogPageComponent,
  PortWorksComponent, PortCollectionsComponent, PortCollectionPageComponent } from './pages/portfolio';
  
import { WorkPageComponent, SectionPageComponent, NewSectionComponent } from './pages/work-page';
  
import { BrowseComponent, GroupsComponent, NewsComponent, PostPageComponent } from './pages';
  
import { DocsPageComponent, SiteStaffComponent } from './pages/docs-page';
  
import { RegisterComponent } from './pages/account';
  
import { AuthGuard } from './services/auth';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';

import { BlogPageResolver, PortfolioResolver, WorkPageResolver, PostPageResolver, NewsFeedResolver, 
  BrowseFeedResolver, MyWorksResolver, MyBlogsResolver, MyCollectionsResolver, PortBlogsResolver,
  PortWorksResolver, PortCollectionsResolver, CollectionPageResolver} from './resolvers';

const routes: Routes = [
    {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, children: [
      {path: '', children: [
        {path: 'latest', component: LatestComponent},
        {path: 'watching', canActivate: [AuthGuard], component: WatchingPageComponent},
        {path: 'collections', canActivate: [AuthGuard], component: CollectionsComponent, resolve: {feedData: MyCollectionsResolver}, runGuardsAndResolvers: 'always'},
        {path: 'history', canActivate: [AuthGuard], component: HistoryPageComponent},
        {path: 'works', canActivate: [AuthGuard], component: WorksComponent, resolve: {feedData: MyWorksResolver}, runGuardsAndResolvers: 'always'},
        {path: 'blogs', canActivate: [AuthGuard], component: BlogsComponent, resolve: {feedData: MyBlogsResolver}, runGuardsAndResolvers: 'always'},
        {path: 'conversations', canActivate: [AuthGuard], component: InboxComponent},
        {path: 'settings', canActivate: [AuthGuard], component: SettingsComponent},
        {path: 'alerts', canActivate: [AuthGuard], component: AlertsComponent},
        {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
      ]}
    ]},
    {path: 'browse', component: BrowseComponent, resolve: {feedData: BrowseFeedResolver}, runGuardsAndResolvers: 'always'},
    {path: 'groups', component: GroupsComponent},
    {path: 'news', component: NewsComponent, resolve: {feedData: NewsFeedResolver }, runGuardsAndResolvers: 'always'},
    {path: 'post/:postId/:postTitle', resolve: {postData: PostPageResolver}, runGuardsAndResolvers: 'always', component: PostPageComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'portfolio/:id/:username', resolve: {portData: PortfolioResolver}, runGuardsAndResolvers: 'always', component: PortfolioComponent, children: [
      {path: 'blog', component: PortBlogComponent, resolve: {feedData: PortBlogsResolver}, runGuardsAndResolvers: 'always'},
      {path: 'blog/:blogId', resolve: {blogData: BlogPageResolver}, runGuardsAndResolvers: 'always', component: PortBlogPageComponent},
      {path: 'works', component: PortWorksComponent, resolve: {feedData: PortWorksResolver}, runGuardsAndResolvers: 'always'},
      {path: 'collections', component: PortCollectionsComponent, resolve: {feedData: PortCollectionsResolver}, runGuardsAndResolvers: 'always'},
      {path: 'collection/:collId', component: PortCollectionPageComponent, resolve: {collData: CollectionPageResolver}, runGuardsAndResolvers: 'always'},
      {path: '', component: PortHomeComponent},
    ]},
    {path: 'work/:workId/:title', component: WorkPageComponent, resolve: {workData: WorkPageResolver}, runGuardsAndResolvers: 'always', children: [    
      {path: ':sectionNum/:sectionTitle', component: SectionPageComponent},    
      {path: 'new-section', canActivate: [AuthGuard], component: NewSectionComponent}
    ]},
    {path: 'search', component: SearchComponent, children: [
      {path: 'users', component: FindUsersComponent},
      {path: 'blogs', component: FindBlogsComponent},
      {path: 'works', component: FindWorksComponent},
    ]},
    {path: 'site-staff', component: SiteStaffComponent},
    {path: 'docs/:docId', component: DocsPageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})],
    exports: [RouterModule],
    providers: [
      WorkPageResolver, BlogPageResolver, PortfolioResolver, PostPageResolver, NewsFeedResolver, BrowseFeedResolver,
      MyWorksResolver, MyBlogsResolver, MyCollectionsResolver, PortWorksResolver, PortBlogsResolver, PortCollectionsResolver,
      CollectionPageResolver
    ]
})
export class AppRoutingModule {}