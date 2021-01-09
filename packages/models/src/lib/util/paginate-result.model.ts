export interface PaginateResult<T> {
    readonly docs: T[];
    readonly totalDocs: number;
    readonly limit: number;
    readonly page?: number;
    readonly totalPages: number;
    readonly nextPage?: number;
    readonly prevPage?: number;
    readonly pagingCounter: number;
    readonly hasPrevPage: boolean;
    readonly hasNextPage: boolean;
    readonly meta?: any;    
}