import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { PipesModule } from '@dragonfish/client/pipes';

/* Pages */
import { MyLibraryComponent } from './my-library.component';

@NgModule({
    declarations: [MyLibraryComponent],
    imports: [CommonModule, MyLibraryRoutingModule, UiModule, IconsModule, MaterialModule, PipesModule],
})
export class MyLibraryModule {}
