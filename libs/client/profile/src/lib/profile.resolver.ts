import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from '@dragonfish/client/repository/profile';

@Injectable()
export class ProfileResolver implements Resolve<any> {
    constructor(private profileService: ProfileService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<any> {
        const pseudId = route.paramMap.get('pseudId');
        return this.profileService.setProfile(pseudId);
    }
}
