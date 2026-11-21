import { BASE_URL } from "#lib/http";
import type { Blog } from "#lib/models/blogs";
import type { Paginate } from "#lib/models/util/tools";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { SESSION_TOKEN_KEY } from "#lib/util/constants";

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    const id = params.id;
    const token = cookies.get(SESSION_TOKEN_KEY);
    let headers = {};
    if (token) {
        headers = {
            "Authorization": `Bearer ${token}`
        }
    }

    const apiResponse = await fetch(`${BASE_URL}/profiles/${id}/blogs`, { method: "GET", headers });
    
    if (apiResponse.ok) {
        return { blogs: (await apiResponse.json()) as Paginate<Blog> };
    }

    return fail(apiResponse.status, { message: (await apiResponse.json()).reason as string });
}