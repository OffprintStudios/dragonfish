// NOTE: USE ONLY FOR ENDPOINTS

import type { AxiosInstance } from "axios";
import Axios from "axios";
import type { HttpConfig } from "./http-config";
import { BASE_URL } from "./base-url";
import type { ResponseError } from "./response-error";

export const http: AxiosInstance = Axios.create({
  timeout: 1000 * 60, // Milliseconds * Seconds
  timeoutErrorMessage: 'Request timed out',
  withCredentials: true,
});

export async function getReq<T = unknown>(url: string, config?: HttpConfig): Promise<T | ResponseError> {
  return http.get<T>(`${BASE_URL}${url}`, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}

export async function delReq<T = unknown>(url: string, config?: HttpConfig): Promise<T | ResponseError> {
  return http.delete<T>(`${BASE_URL}${url}`, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}

export async function postReq<T = unknown>(url: string, data: unknown, config?: HttpConfig): Promise<T | ResponseError> {
  return http.post<T>(`${BASE_URL}${url}`, data, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}

export async function putReq<T = unknown>(url: string, data: unknown, config?: HttpConfig): Promise<T | ResponseError> {
  return http.put<T>(`${BASE_URL}${url}`, data, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}

export async function patchReq<T = unknown>(url: string, data: unknown, config?: HttpConfig): Promise<T | ResponseError> {
  return http.patch<T>(`${BASE_URL}${url}`, data, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}

export async function headReq<T = unknown>(url: string, config?: HttpConfig): Promise<T | ResponseError> {
  return http.head<T>(`${BASE_URL}${url}`, config)
    .then(res => res.data)
    .catch(error => {
      if (error.isAxiosError) {
        return error.data;
      } else {
        return {
          statusCode: 500,
          message: `An unknown error has occurred. Please try again in a little bit.`,
          error: 'Internal Server Error'
        };
      }
    });
}
