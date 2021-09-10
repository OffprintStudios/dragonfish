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
import { NgxPaginationModule } from 'ngx-pagination';

/* Views */
import { ProfileComponent } from './profile.component';
import { Views } from './views';

/* Components */
import { ProfileTopbarComponent } from './components';

/* Repository */
import { ProfileStore, ProfileQuery, ProfileService } from './repo';

@NgModule({
    declarations: [ProfileComponent, ProfileTopbarComponent, ...Views],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        PipesModule,
        AlertsModule,
        CommentsModule,
        NgxPaginationModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
            track: 'all',
            visibility: 'native',
        }),
    ],
    providers: [ProfileStore, ProfileQuery, ProfileService],
})
export class ProfileModule {}
