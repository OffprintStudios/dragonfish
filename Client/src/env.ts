import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
    API_URL: { public: true }
});