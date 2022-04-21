import { http } from '$lib/services/http';
import type { Profile } from '$lib/models/accounts';
import type { ChangeScreenName, ChangeBio, ChangeTagline } from '$lib/models/accounts/forms';
import type { Observable } from 'rxjs';
import { baseUrl } from '$lib/util';
import { from, take } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ContentFilter, Content } from '$lib/models/content';
import type { FollowingUser } from '$lib/models/activity';

//#region ---PROFILE PAGE---

export async function getProfile(profileId: string): Promise<Profile> {
    return http.get<Profile>(`${baseUrl}/user/get-profile?pseudId=${profileId}`).then((res) => {
        return res.data;
    });
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

//#endregion

//#region ---FOLLOWERS---

export async function fetchFollowers(profileId: string): Promise<FollowingUser[]> {
    return http
        .get<FollowingUser[]>(`${baseUrl}/followers/fetch-followers?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchFollowing(profileId: string): Promise<FollowingUser[]> {
    return http
        .get<FollowingUser[]>(`${baseUrl}/followers/fetch-following?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function checkIfFollowing(
    profileId: string,
    isFollowing: string,
): Promise<FollowingUser> {
    return http
        .get<FollowingUser>(
            `${baseUrl}/followers/check-if-following?pseudId=${profileId}&isFollowing=${isFollowing}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function followUser(profileId: string, toFollow: string): Promise<FollowingUser> {
    return http
        .post<FollowingUser>(
            `${baseUrl}/followers/follow-user?pseudId=${profileId}&toFollow=${toFollow}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function unfollowUser(profileId: string, toUnfollow: string): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/followers/unfollow-user?pseudId=${profileId}&toUnfollow=${toUnfollow}`,
        )
        .then(() => {
            return;
        });
}

//#endregion

//#region ---PROFILE SETTINGS---

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

//#endregion
