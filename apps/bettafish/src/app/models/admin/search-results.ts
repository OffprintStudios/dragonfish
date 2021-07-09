import { Pagination } from './pagination';

export interface SearchResults<T> {
    matches: T[];
    pagination: Pagination;
    totalPages: number;
}
