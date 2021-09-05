import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { PipesModule } from '@dragonfish/client/pipes';
import { AlertsModule } from '@dragonfish/client/alerts';
import { CommentsModule } from '@dragonfish/client/comments';
import { NgScrollbarModule } from 'ngx-scrollbar';

/* Views */
import { ProfileComponent } from './profile.component';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        PipesModule,
        AlertsModule,
        CommentsModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
            track: 'all',
        }),
    ],
})
export class ProfileModule {}
