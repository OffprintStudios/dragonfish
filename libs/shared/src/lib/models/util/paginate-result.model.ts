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
        this.docs = this.docs.filter((x: any) => {
            return x._id !== docId;
        });
    }
}
