import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pipes } from './pipes';

@NgModule({
    declarations: [...Pipes],
    imports: [CommonModule],
    exports: [...Pipes],
})
export class PipesModule {}
