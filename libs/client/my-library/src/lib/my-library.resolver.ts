import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentLibraryService } from '@dragonfish/client/repository/content-library';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';

@Injectable()
export class MyLibraryResolver implements Resolve<ContentLibrary[]> {
    constructor(private library: ContentLibraryService) {}

    resolve(): Observable<ContentLibrary[]> {
        return this.library.fetchLibrary();
    }
}
