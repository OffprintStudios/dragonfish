import type { AxiosResponse } from "axios";
import { from, map, Observable, take } from "rxjs";

export function pipeData<T>(response: Promise<AxiosResponse<T>>): Observable<T> {
    return from(response).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}
