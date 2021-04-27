import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { handleResponse } from '@dragonfish/shared/functions';
import { InviteCodes } from '@dragonfish/shared/models/users';

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
}
