import { HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Handles a common response pattern for HTTP requests. Automatically returns the response
 * body on success, or calls `throwError(err)` on error. Allows a callback to be passed in,
 * which will be called before returning success or error.
 * @param response An observable wrapped around the HTTP request.
 * @param onSuccess A callback to call upon success. Defaults to null.
 * @param onError A callback to call upon error. Defaults to null.
 */
export function handleResponse<T>(
    response: Observable<HttpResponse<T>>,
    onSuccess: (success: HttpResponse<T>) => void = null,
    onError: (error: any) => void = null
): Observable<T> {
    return response.pipe(
        map((resp) => {
            if (onSuccess) {
                onSuccess(resp);
            }
            return resp.body;
        }),
        catchError((err) => {
            if (onError) {
                onError(err);
            }
            return throwError(err);
        })
    );
}
