import type { AxiosRequestConfig } from "axios";

export interface HttpConfig extends AxiosRequestConfig {
  observe?: 'response' | 'body';
}
