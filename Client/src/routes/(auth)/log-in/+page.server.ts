import type { Actions, PageServerLoad } from "./$types";
import { BASE_URL } from "#lib/http";
import type { Account } from "#lib/models/accounts";
import { redirect, fail } from "@sveltejs/kit";
import { DEFAULT_EXPIRATION, SESSION_TOKEN_KEY } from "#lib/util/constants";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get(SESSION_TOKEN_KEY);

    if (token) {
        redirect(303, "/switch-profile");
    }
}

export const actions = {
    default: async ({ request, fetch, cookies }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const rememberMe = data.get("remember-me");

        const authAsBase64 = btoa(`${email?.toString()}:${password?.toString()}`);
        const apiResponse = await fetch(`${BASE_URL}/auth/log-in`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authAsBase64}`,
                "X-Offprint-Remember-Me": rememberMe === "on" ? "long" : "short",
            }
        });

        if (apiResponse.ok) {
            const account: Account = await apiResponse.json();
            cookies.delete(SESSION_TOKEN_KEY, { path: "/" });
            cookies.set(SESSION_TOKEN_KEY, account.token!, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: DEFAULT_EXPIRATION,
            });

            return redirect(303, "/switch-profile");
        } else {
            if (apiResponse.status === 405) {
                return redirect(303, "/check-email");
            } else {
                const apiError = await apiResponse.json();
                return fail(apiResponse.status, { message: apiError.reason });
            }
        }
    }
} satisfies Actions;