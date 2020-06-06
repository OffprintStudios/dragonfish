import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, LatestComponent, SubscriptionsComponent, CollectionsComponent, WorksComponent, BlogsComponent, InboxComponent, SettingsComponent } from './pages/home';
import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
import { RegisterComponent } from './pages/account';
import { AuthGuard } from './services/auth';

const routes: Routes = [
  {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, children: [
    {path: '', children: [
      {path: 'latest', component: LatestComponent},
      {path: 'subscriptions', canActivate: [AuthGuard], component: SubscriptionsComponent},
      {path: 'collections', canActivate: [AuthGuard], component: CollectionsComponent},
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
