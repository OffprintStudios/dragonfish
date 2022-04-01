import type { AxiosRequestConfig } from 'axios';

export interface HttpOptions extends AxiosRequestConfig {
    observe?: 'response' | 'body';
}
