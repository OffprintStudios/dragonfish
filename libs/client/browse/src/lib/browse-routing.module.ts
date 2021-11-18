import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { BrowseHomeComponent } from './views/content-browsing';

const routes: Routes = [
    {
        path: '',
        component: BrowseComponent,
        children: [
            {
                path: '',
                component: BrowseHomeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class BrowseRoutingModule {}
