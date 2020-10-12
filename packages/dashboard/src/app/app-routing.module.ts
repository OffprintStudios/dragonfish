import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth';
import { Roles } from '@pulp-fiction/models/users';

import { EditNewsPostResolver } from './resolvers';

import { AuditComponent } from './pages/audit';
import { CreateDocComponent, DocsComponent, EditDocComponent } from './pages/docs';
import { HomeComponent } from './pages/home';
import { NewsComponent, PostFormComponent, PreviewPostComponent } from './pages/news';
import { QueueComponent } from './pages/queue';
import { ReportsComponent } from './pages/reports';
import { UsersComponent } from './pages/users';


const routes: Routes = [
  {path: 'home', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor, Roles.WorkApprover]}, component: HomeComponent},
  {path: 'queue', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor, Roles.WorkApprover]}, component: QueueComponent},
  {path: 'news', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor]}, component: NewsComponent, children: [
    {path: 'create-post', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor]}, component: PostFormComponent},
    {path: 'edit-post/:postId', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor]}, resolve: {post: EditNewsPostResolver}, component: PostFormComponent},
    {path: 'preview-post/:postId', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor]}, resolve: {post: EditNewsPostResolver}, component: PreviewPostComponent}
  ]},
  {path: 'docs', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator, Roles.Contributor]}, component: DocsComponent, children: [
    {path: 'create-doc', canActivate: [AuthGuard], component: CreateDocComponent, data: {roles: [Roles.Admin]}},
    {path: 'edit-doc/:docId', canActivate: [AuthGuard], component: EditDocComponent, data: {roles: [Roles.Contributor, Roles.Moderator, Roles.Admin]}},
  ]},
  {path: 'reports', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator]}, component: ReportsComponent},
  {path: 'users', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator]}, component: UsersComponent},
  {path: 'audit', canActivate: [AuthGuard], data: {roles: [Roles.Admin, Roles.Moderator]}, component: AuditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
