import type { Actions, PageServerLoad } from "./$types";
import { BASE_URL } from "#lib/http";
import { redirect, fail } from "@sveltejs/kit";
import type { RegisterForm } from "#lib/models/accounts";
import { SESSION_TOKEN_KEY } from "#lib/util/constants.ts";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get(SESSION_TOKEN_KEY);

    if (token) {
        redirect(303, "/switch-profile");
    }
}

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const repeatPassword = data.get("repeat-password");
        const ageCheck = data.get("age-check");
        const termsAgree = data.get("terms-agree");

        if ((password !== null || repeatPassword !== null) && (password?.toString() !== repeatPassword?.toString())) {
            return fail(422, { message: "The passwords you entered do not match." });
        }

        const formInfo: RegisterForm = {
            email: email!.toString(),
            password: password!.toString(),
            ageCheck: !!(ageCheck!),
            termsAgree: !!(termsAgree!),
        };

        const apiResponse = await fetch(`${BASE_URL}/auth/sign-up`, {
            method: "POST",
            body: JSON.stringify(formInfo),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (apiResponse.ok) {
            return redirect(303, "/confirm-email");
        } else {
            const apiError = await apiResponse.json();
            return fail(apiResponse.status, { message: apiError.reason })
        }
    }
} satisfies Actions;