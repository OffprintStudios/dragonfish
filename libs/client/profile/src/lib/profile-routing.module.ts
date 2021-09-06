import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileComponent } from './profile.component';

/* Misc */
import { ProfileResolver } from './repo';

const routes: Routes = [
    {
        path: ':pseudId/:userTag',
        component: ProfileComponent,
        resolve: { profileData: ProfileResolver },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    providers: [ProfileResolver],
})
export class ProfileRoutingModule {}
