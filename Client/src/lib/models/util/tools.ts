export interface Paginate<T> {
    items: T[];
    metadata: {
        page: number;
        per: number;
        total: number;
    };
}