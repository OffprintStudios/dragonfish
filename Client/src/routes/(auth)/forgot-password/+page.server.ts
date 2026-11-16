import { BASE_URL } from "#lib/http";
import { ONE_TIME_CODE_KEY } from "#lib/util/constants";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const token = url.searchParams.get(ONE_TIME_CODE_KEY);

    if (!token) return { missing: true };

    const apiResponse = await fetch(`${BASE_URL}/auth/confirm-email`, {
        method: "PATCH",
        body: JSON.stringify({ token }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (apiResponse.ok) {
        return { success: true };
    }

    return { error: true };
}

export const actions = {
    sendEmail: async ({ request, fetch }) => {
        const data = await request.formData();
        const email = data.get("email");

        await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: "PATCH",
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        return { message: "If the email you entered belongs to a valid Offprint account, we've sent it instructions on how to reset your password." };
    },
    resetPassword: async ({ request, url, fetch }) => {
        const data = await request.formData();
        const newPassword = data.get("new-password");
        const repeatPassword = data.get("repeat-password");
        const token = url.searchParams.get(ONE_TIME_CODE_KEY);

        if (!token) {
            return fail(422, { message: "Wait a minute, something ain't right!" });
        }

        if ((newPassword !== null || repeatPassword !== null) && (newPassword?.toString() !== repeatPassword?.toString())) {
            return fail(422, { message: "The passwords you entered do not match." });
        }

        const apiResponse = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: "PATCH",
            body: JSON.stringify({ token, newPassword }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (apiResponse.ok) {
            return { success: true };
        }

        return fail(500, { message: "Uh-oh. Looks like something went wrong." });
    }
} satisfies Actions;