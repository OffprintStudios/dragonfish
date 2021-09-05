import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    {
        path: ':pseudId/:userTag',
        component: ProfileComponent,
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
})
export class ProfileRoutingModule {}
