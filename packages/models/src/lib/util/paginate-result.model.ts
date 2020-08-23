export interface PaginateResult<T> {
    readonly docs: T[];
    readonly totalDocs: number;
    readonly limit: number;
    readonly hasPrevPage: boolean;
    readonly hasNextPage: boolean;
    readonly page: number;
    readonly totalPages: number;
    readonly offset?: number;
    readonly prevPage: number;
    readonly nextPage: number;
    readonly pagingCounter: number;
    readonly meta?: {};
}