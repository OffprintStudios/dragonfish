import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileRepository } from '@dragonfish/client/repository/profile';

@Injectable()
export class ProfileResolver implements Resolve<void> {
    constructor(private profile: ProfileRepository) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        const pseudId = route.paramMap.get('pseudId');
        return this.profile.setProfile(pseudId);
    }
}
