import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2FittextModule } from 'ng2-fittext';
import { MaterialModule } from '@dragonfish/material';
import { IconsModule } from '@dragonfish/icons';
import { PipesModule } from '@dragonfish/pipes';

import { RatingIconComponent } from './components/rating-icon/rating-icon.component';
import { RoleBadgeComponent } from './components/role-badge/role-badge.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { WorkCardComponent } from './components/work-card/work-card.component';

@NgModule({
    declarations: [
        RatingIconComponent,
        RoleBadgeComponent,
        UserCardComponent,
        WorkCardComponent,
    ],
    imports: [
        CommonModule,
        IconsModule,
        PipesModule,
        MaterialModule,
        Ng2FittextModule,
        RouterModule.forChild([]),
    ],
    exports: [
        RatingIconComponent,
        RoleBadgeComponent,
        UserCardComponent,
        WorkCardComponent,
    ],
})
export class ComponentsModule {}
