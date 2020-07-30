
import {Document} from 'mongoose';
import {Pagination} from './pagination';

export interface SearchResults<T extends Document> {
    matches: T[],
    pagination: Pagination,
    totalPages: number
}
