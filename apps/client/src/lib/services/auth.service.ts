import { http } from './http';
import type { RegisterForm, LoginForm, ProfileForm } from '$lib/models/accounts/forms';
import type { Account, Profile } from '$lib/models/accounts';
import type { LoginPackage } from '$lib/models/auth';
import { baseUrl } from '$lib/util';
import type { Roles } from '$lib/models/accounts';
import * as lodash from 'lodash';

export async function login(formInfo: LoginForm): Promise<LoginPackage> {
    return http.post<LoginPackage>(`${baseUrl}/auth/login`, formInfo).then((res) => {
        return res.data;
    });
}

export async function register(formInfo: RegisterForm): Promise<LoginPackage> {
    return http.post<LoginPackage>(`${baseUrl}/auth/register`, formInfo).then((res) => {
        return res.data;
    });
}

export async function logout(): Promise<void> {
    return http.get<void>(`${baseUrl}/auth/logout`).then(() => {
        return;
    });
}

export async function refreshToken(): Promise<string | null> {
    return http
        .get<{ newToken: string }>(`${baseUrl}/auth/refresh-token`)
        .then((res) => {
            return res.data.newToken;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function addProfile(formInfo: ProfileForm): Promise<Profile> {
    return http.post<Profile>(`${baseUrl}/auth/add-pseudonym`, formInfo).then((res) => {
        return res.data;
    });
}

export function checkProfile(profile: Profile, account: Account): boolean {
    return !!account.pseudonyms.find((value) => value._id === profile._id);
}

export function isAllowed(roles: Roles[], requiredRoles: Roles[]): boolean {
    const hasRoles = lodash.intersection(roles, requiredRoles);

    return hasRoles.length > 0;
}
