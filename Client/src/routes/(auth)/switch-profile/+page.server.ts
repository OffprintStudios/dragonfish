import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { BASE_URL } from "#lib/http";
import type { Profile } from "#lib/models/accounts";
import { DEFAULT_EXPIRATION, PROFILE_ID_KEY, SESSION_TOKEN_KEY } from "#lib/util/constants.ts";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get(SESSION_TOKEN_KEY);

    if (!token) {
        error(401, "Unauthorized");
    }

    const apiResponse = await fetch(`${BASE_URL}/accounts/profiles/all`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (apiResponse.ok) {
        const result: Profile[] = await apiResponse.json();
        return { profiles: result };
    } else {
        error(apiResponse.status, apiResponse.statusText);
    }
}

export const actions = {
    select: async ({ request, cookies, fetch }) => {
        const data = await request.formData();
        const profileID = data.get('profileID')?.toString();

        const apiResponse = await fetch(`${BASE_URL}/accounts/verify`, {
            method: 'POST',
            body: JSON.stringify({ profileID }),
            headers: {
                "Authorization": `Bearer ${cookies.get(SESSION_TOKEN_KEY)}`,
                "Content-Type": "application/json"
            }
        });
        if (apiResponse.ok) {
            cookies.delete(PROFILE_ID_KEY, { path: "/" });
            cookies.set(PROFILE_ID_KEY, profileID!, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: DEFAULT_EXPIRATION,
            });
            return redirect(303, "/");
        } else {
            const apiError = await apiResponse.json();
            return fail(apiResponse.status, { message: apiError.reason });
        }
    }
} satisfies Actions;