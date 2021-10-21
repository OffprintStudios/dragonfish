import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Pages */
import { MyLibraryComponent } from './my-library.component';

/* Misc */
import { MyLibraryResolver } from './my-library.resolver';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

const routes: Routes = [
    {
        path: '',
        component: MyLibraryComponent,
        canActivate: [AuthGuard],
        resolve: { contentData: MyLibraryResolver },
        runGuardsAndResolvers: 'always',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [MyLibraryResolver],
})
export class MyLibraryRoutingModule {}
