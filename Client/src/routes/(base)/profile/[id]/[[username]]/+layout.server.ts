import { BASE_URL } from "#lib/http";
import type { Profile } from "#lib/models/accounts";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, fetch }) => {
    const id = params.id;

    const apiResponse = await fetch(`${BASE_URL}/profiles/${id}`, {
        method: "GET",
    });

    if (apiResponse.ok) {
        return { profile: (await apiResponse.json()) as Profile };
    }

    error(apiResponse.status, apiResponse.statusText);
}