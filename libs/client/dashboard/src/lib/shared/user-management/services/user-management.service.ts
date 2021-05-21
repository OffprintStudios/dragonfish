import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { handleResponse } from '@dragonfish/shared/functions';
import { CreateFandomTag, FandomTags, InviteCodes } from '@dragonfish/shared/models/users';
import { Observable } from 'rxjs';

@Injectable()
export class UserManagementService {
    private url = `/api/user-management`;

    constructor(private http: HttpClient) {}

    public generateCode() {
        return handleResponse(
            this.http.get<InviteCodes>(`${this.url}/generate-code`, {
                observe: 'response',
                withCredentials: true
            })
        )
    }

    public createFandomTag(newFandomTag: CreateFandomTag): Observable<FandomTags> {
        return handleResponse(
            this.http.put<FandomTags>(`${this.url}/create-fandom-tag`, newFandomTag, {
                observe: 'response',
                withCredentials: true,
            })
        )
    }

    public fetchAllFandomTags(): Observable<FandomTags[]> {
        return handleResponse(
            this.http.get<FandomTags[]>(`${this.url}/fetch-all-fandom-tags`, {
                observe: 'response',
                withCredentials: true
            })
        )
    }
}
