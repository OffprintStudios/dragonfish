import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';

/* Pages */
import { MyLibraryComponent } from './my-library.component';

@NgModule({
    declarations: [MyLibraryComponent],
    imports: [CommonModule, MyLibraryRoutingModule],
})
export class MyLibraryModule {}
