import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Pages */
import { MyLibraryComponent } from './my-library.component';

const routes: Routes = [{ path: '', component: MyLibraryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyLibraryRoutingModule {}
