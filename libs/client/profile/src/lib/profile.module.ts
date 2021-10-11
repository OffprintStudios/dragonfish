import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { PipesModule } from '@dragonfish/client/pipes';
import { AlertsModule } from '@dragonfish/client/alerts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditorLiteModule } from '@dragonfish/client/editor-lite';

/* Views */
import { Views } from './views';

/* Components */
import { Components } from './components';

@NgModule({
    declarations: [...Views, ...Components],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        PipesModule,
        AlertsModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        EditorLiteModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
            track: 'all',
            visibility: 'native',
        }),
    ],
    providers: [],
})
export class ProfileModule {}
