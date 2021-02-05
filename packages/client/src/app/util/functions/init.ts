import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export function init(http: HttpClient) {
    return () => {
        return http.get(`${environment.apiUrl}/api/init`, {withCredentials: true})
            .toPromise();
    }
}