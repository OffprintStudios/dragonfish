import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    exports: [],
})
export class ClientServicesModule {}

export { DragonfishNetworkService } from './dragonfish-network.service';
export { DragonfishElectronService } from './dragonfish-electron.service';
