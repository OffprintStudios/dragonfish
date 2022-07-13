import { prod } from "$app/env";

export const BASE_URL = prod ? `https://api.offprint.net` : `http://127.0.0.1:3333`;
