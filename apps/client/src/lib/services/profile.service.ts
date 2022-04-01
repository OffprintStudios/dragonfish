import { http } from '$lib/services/http';
import type { Profile } from '$lib/models/accounts';
import type { ChangeScreenName, ChangeBio, ChangeTagline } from '$lib/models/accounts/forms';
import type { Observable } from 'rxjs';
import { baseUrl } from '$lib/util';
import { from, take } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ContentFilter, Content } from '$lib/models/content';
import type { AxiosResponse } from 'axios';

export async function getProfile(profileId: string): Promise<AxiosResponse<Profile>> {
    return http.get<Profile>(`${baseUrl}/user/get-profile?pseudId=${profileId}`);
}

export function getProfileContent(
    profileId: string,
    filter: ContentFilter,
): Observable<{ works: Content[]; blogs: Content[] }> {
    return from(
        http.get<{ works: Content[]; blogs: Content[] }>(
            `${baseUrl}/browse/get-profile-content?pseudId=${profileId}&filter=${filter}`,
        ),
    ).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function changeScreenName(profileId: string, formInfo: ChangeScreenName): Promise<Profile> {
    return http
        .patch<Profile>(`${baseUrl}/user/change-screen-name?pseudId=${profileId}`, formInfo)
        .then((res) => {
            return res.data;
        });
}

export function changeBio(profileId: string, formInfo: ChangeBio): Promise<Profile> {
    return http
        .patch<Profile>(`${baseUrl}/user/change-bio?pseudId=${profileId}`, formInfo)
        .then((res) => {
            return res.data;
        });
}

export function changeTagline(profileId: string, formInfo: ChangeTagline): Promise<Profile> {
    return http
        .patch<Profile>(`${baseUrl}/user/change-tagline?pseudId=${profileId}`, formInfo)
        .then((res) => {
            return res.data;
        });
}
