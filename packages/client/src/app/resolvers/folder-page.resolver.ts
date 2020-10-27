import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { Folder } from '@pulp-fiction/models/content';
import { MyStuffService } from '../services/user';
import { Types } from 'mongoose';

@Injectable()
export class FolderPageResolver implements Resolve<Folder> {
    constructor (private stuffService: MyStuffService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Folder> {
        const folderId = route.paramMap.get('folderId');
        const folderObjId = Types.ObjectId(folderId);

        return this.stuffService.fetchOneFolder(folderObjId);
    }
}