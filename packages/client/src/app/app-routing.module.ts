import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, LatestComponent, WatchingPageComponent } from './pages/home';
  
import { PortfolioComponent, PortHomeComponent, PortBlogPageComponent,
  WorksComponent, PortCollectionPageComponent, SettingsComponent,
  BlogsComponent, CollectionsComponent, NotificationsComponent, ConversationsComponent,
  HistoryComponent } from './pages/portfolio';

import { MyStuffComponent, ProseFormComponent, BlogFormComponent, PoetryFormComponent,
  ViewProseComponent, ViewPoetryComponent } from './pages/my-stuff';
  
import { WorkPageComponent, SectionPageComponent, NewSectionComponent } from './pages/work-page';
  
import { BrowseComponent, GroupsComponent, NewsComponent, PostPageComponent } from './pages';
  
import { DocsPageComponent, SiteStaffComponent } from './pages/docs-page';
  
import { RegisterComponent } from './pages/account';
  
import { AuthGuard } from './services/auth';
import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';

import { BlogPageResolver, PortfolioResolver, WorkPageResolver, PostPageResolver, NewsFeedResolver, 
  BrowseFeedResolver, MyWorksResolver, MyBlogsResolver, MyCollectionsResolver, PortBlogsResolver,
  PortWorksResolver, PortCollectionsResolver, CollectionPageResolver, MyStuffResolver, ViewContentResolver } from './resolvers';

const routes: Routes = [
    {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, children: [
      {path: '', children: [
        {path: 'latest', component: LatestComponent},
        {path: 'watching', canActivate: [AuthGuard], component: WatchingPageComponent},
        {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
      ]}
    ]},
    {path: 'browse', component: BrowseComponent, resolve: {feedData: BrowseFeedResolver}, runGuardsAndResolvers: 'always'},
    {path: 'groups', component: GroupsComponent},
    {path: 'news', component: NewsComponent, resolve: {feedData: NewsFeedResolver }, runGuardsAndResolvers: 'paramsChange'},
    {path: 'post/:postId/:postTitle', resolve: {postData: PostPageResolver}, runGuardsAndResolvers: 'always', component: PostPageComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'my-stuff', component: MyStuffComponent, canActivate: [AuthGuard], resolve: {stuffData: MyStuffResolver}, runGuardsAndResolvers: 'always', children: [
      {path: 'new-blog', component: BlogFormComponent, canActivate: [AuthGuard]},
      {path: 'new-prose', component: ProseFormComponent, canActivate: [AuthGuard]},
      {path: 'new-poetry', component: PoetryFormComponent, canActivate: [AuthGuard]},
      {path: 'view-blog', component: BlogFormComponent, canActivate: [AuthGuard], resolve: {blogData: ViewContentResolver}, runGuardsAndResolvers: 'always'},
      {path: 'view-prose', component: ViewProseComponent, canActivate: [AuthGuard], resolve: {proseData: ViewContentResolver}, runGuardsAndResolvers: 'always'},
      {path: 'view-poetry', component: ViewPoetryComponent, canActivate: [AuthGuard], resolve: {poetryData: ViewContentResolver}, runGuardsAndResolvers: 'always'},
      {path: 'edit-prose', component: ProseFormComponent, canActivate: [AuthGuard], resolve: {proseData: ViewContentResolver}, runGuardsAndResolvers: 'always'},
      {path: 'edit-poetry', component: PoetryFormComponent, canActivate: [AuthGuard], resolve: {poetryData: ViewContentResolver}, runGuardsAndResolvers: 'always'}
    ]},
    {path: 'portfolio/:id/:username', resolve: {portData: PortfolioResolver}, runGuardsAndResolvers: 'always', component: PortfolioComponent, children: [
      {path: 'blogs', component: BlogsComponent, resolve: {feedData: PortBlogsResolver}, runGuardsAndResolvers: 'always'},
      {path: 'blog/:blogId', resolve: {blogData: BlogPageResolver}, runGuardsAndResolvers: 'paramsChange', component: PortBlogPageComponent},
      {path: 'works', component: WorksComponent, resolve: {feedData: PortWorksResolver}, runGuardsAndResolvers: 'always'},
      {path: 'collections', component: CollectionsComponent, resolve: {feedData: PortCollectionsResolver}, runGuardsAndResolvers: 'always'},
      {path: 'collection/:collId', component: PortCollectionPageComponent, resolve: {collData: CollectionPageResolver}, runGuardsAndResolvers: 'always'},
      {path: 'history', component: HistoryComponent, canActivate: [AuthGuard]},
      {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
      {path: 'conversations', component: ConversationsComponent, canActivate: [AuthGuard]},
      {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
      {path: 'home', component: PortHomeComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'}
    ]},
    {path: 'work/:workId/:title', component: WorkPageComponent, resolve: {workData: WorkPageResolver}, runGuardsAndResolvers: 'paramsChange', children: [    
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
      CollectionPageResolver, MyStuffResolver, ViewContentResolver,
    ]
})
export class AppRoutingModule {}