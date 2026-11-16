import type { Actions, PageServerLoad } from "./$types";
import { fail, error, redirect } from "@sveltejs/kit";
import { BASE_URL } from "#lib/http";
import type { ProfileForm } from "#lib/models/accounts";
import { SESSION_TOKEN_KEY } from "#lib/util/constants.ts";


export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get(SESSION_TOKEN_KEY);

    if (!token) {
        error(401, "Unauthorized");
    }
}

export const actions = {
    default: async ({ request, fetch, cookies }) => {
        const data = await request.formData();
        const username = data.get("username");

        if (!username || (username!.toString().trim().length < 3 || username!.toString().trim().length > 32)) {
            return fail(400, { message: "Usernames needs to be between 3 and 32 characters long." });
        }

        const formInfo: ProfileForm =  {
            username: username!.toString().trim(),
            links: [],
        }

        console.log(JSON.stringify(formInfo));

        const apiResponse = await fetch(`${BASE_URL}/accounts/profiles/create`, {
            method: "POST",
            body: JSON.stringify(formInfo),
            headers: {
                'Authorization': `Bearer ${cookies.get(SESSION_TOKEN_KEY)}`,
                "Content-Type": "application/json"
            }
        });

        if (apiResponse.ok) {
            return redirect(303, "/switch-profile");
        } else {
            const apiError = await apiResponse.json();
            return fail(400, { message: apiError.reason });
        }
    }
} satisfies Actions;