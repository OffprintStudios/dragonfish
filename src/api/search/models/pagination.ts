export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

function parseFiniteIntOrDefault(s: string, d?: number): number {
    if (!d) {
        d = 0;
    }

    let out = parseInt(s);
    if (isNaN(out) || !isFinite(out)) {
        out = d;
    }

    return out;
}

export class Pagination {
    readonly page: number; // 1-indexed
    readonly pageSize?: number;
    constructor(params: {[key: string]: string}) {
        if (params.page) {
            let parsed = parseFiniteIntOrDefault(params.page, 1);
            parsed = Math.max(parsed, 1);
            this.page = parsed;
        } else {
            this.page = 1;
        }

        if (params.pageSize) {
            this.pageSize = parseFiniteIntOrDefault(params.pageSize, DEFAULT_PAGE_SIZE);
            this.pageSize = Math.min(this.pageSize, MAX_PAGE_SIZE);
            this.pageSize = Math.max(this.pageSize, 1);
        } else {
            this.pageSize = DEFAULT_PAGE_SIZE;
        }
    }
}
