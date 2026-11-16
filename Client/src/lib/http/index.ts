import { API_URL } from "$app/env/public";

export const BASE_URL = API_URL ? API_URL : "http://127.0.0.1:3333";

export interface ResponseError {
    readonly statusCode: number;
    readonly message: string;
    readonly error: string;
};