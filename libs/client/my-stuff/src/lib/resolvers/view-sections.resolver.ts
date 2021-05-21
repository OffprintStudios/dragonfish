import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Section } from '@dragonfish/shared/models/sections';
import { MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { SectionsService } from '@dragonfish/client/repository/my-stuff/sections';

@Injectable()
export class ViewSectionsResolver implements Resolve<Section[]> {
    constructor(private stuffQuery: MyStuffQuery, private sections: SectionsService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Section[]> {
        return this.sections.setAll(this.stuffQuery.currentId);
    }
}
