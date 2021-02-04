import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NagBarComponent } from './nag-bar.component';

@NgModule({
    declarations: [NagBarComponent],
    imports: [CommonModule],
    exports: [NagBarComponent],
})
export class NagBarModule {}
