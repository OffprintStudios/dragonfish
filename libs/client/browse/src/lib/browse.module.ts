import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { BrowseHomeComponent } from './views/content-browsing';

@NgModule({
    imports: [CommonModule, BrowseRoutingModule, UiModule, IconsModule, MaterialModule],
    declarations: [BrowseComponent, BrowseHomeComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrowseModule {}
