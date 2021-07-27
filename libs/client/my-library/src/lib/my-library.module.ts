import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';

/* Pages */
import { MyLibraryComponent } from './my-library.component';

@NgModule({
    declarations: [MyLibraryComponent],
    imports: [
        CommonModule,
        MyLibraryRoutingModule,
        UiModule,
        IconsModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
        }),
    ],
})
export class MyLibraryModule {}
