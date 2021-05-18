import { Injectable } from '@angular/core';
import { MyStuffStore } from './my-stuff.store';
import { MyStuffQuery } from './my-stuff.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';

@Injectable({ providedIn: 'root' })
export class MyStuffService {
    constructor(
        private myStuffStore: MyStuffStore,
        private myStuffQuery: MyStuffQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService
    ) {}
}
