import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, LatestComponent, WatchingComponent, CollectionsComponent, WorksComponent,
  BlogsComponent, InboxComponent, SettingsComponent, HistoryComponent } from './pages/home';

import { PortfolioComponent, PortHomeComponent, PortBlogComponent, PortBlogPageComponent,
  PortWorksComponent, PortCollectionsComponent } from './pages/portfolio';

import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';

import { RegisterComponent } from './pages/account';

import { AuthGuard } from './services/auth';

const routes: Routes = [
  {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, children: [
    {path: '', children: [
      {path: 'latest', component: LatestComponent},
      {path: 'watching', canActivate: [AuthGuard], component: WatchingComponent},
      {path: 'collections', canActivate: [AuthGuard], component: CollectionsComponent},
      {path: 'history', canActivate: [AuthGuard], component: HistoryComponent},
      {path: 'works', canActivate: [AuthGuard], component: WorksComponent},
      {path: 'blogs', canActivate: [AuthGuard], component: BlogsComponent},
      {path: 'inbox', canActivate: [AuthGuard], component: InboxComponent},
      {path: 'settings', canActivate: [AuthGuard], component: SettingsComponent},
      {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
    ]}
  ]},
  {path: 'browse', component: BrowseComponent},
  {path: 'groups', component: GroupsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'portfolio/:id/:username', component: PortfolioComponent, children: [
    { path: '', component: PortHomeComponent },
    { path: 'blogs', component: PortBlogComponent },
    { path: 'blog/:blogId', component: PortBlogPageComponent },
    { path: 'works', component: PortWorksComponent },
    { path: 'collections', component: PortCollectionsComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
