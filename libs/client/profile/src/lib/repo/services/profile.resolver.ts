import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileResolver implements Resolve<any> {
    constructor(private profileService: ProfileService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<any> {
        const pseudId = route.paramMap.get('pseudId');
        return this.profileService.setProfile(pseudId).pipe(untilDestroyed(this));
    }
}
