/*export interface PaginateResult<T> {
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
}*/

export class PaginateResult<T> {
    public docs: T[];
    public readonly totalDocs: number;
    public readonly limit: number;
    public readonly page?: number;
    public readonly totalPages: number;
    public readonly nextPage?: number;
    public readonly prevPage?: number;
    public readonly pagingCounter: number;
    public readonly hasPrevPage: boolean;
    public readonly hasNextPage: boolean;
    public readonly meta?: any;

    public removeDoc(docId: string) {
        this.docs = this.docs.filter((x: any) => { return x._id !== docId });
    }
}