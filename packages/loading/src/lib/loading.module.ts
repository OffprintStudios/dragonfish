import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './component/loading.component';
import { MaterialModule } from '@pulp-fiction/material';
import { LoadingService } from './service/loading.service';
import { LoadingInterceptor } from './service/loading.interceptor';

@NgModule({
  imports: [
    CommonModule, MaterialModule
  ],
  declarations: [LoadingComponent],
  exports: [LoadingService, LoadingComponent, LoadingInterceptor]
})
export class LoadingModule {}
