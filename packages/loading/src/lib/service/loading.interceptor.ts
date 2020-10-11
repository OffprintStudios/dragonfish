import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoadingService } from "./loading.service";
import { finalize } from "rxjs/operators";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  activeRequests: number = 0;
  skipUrls = [
      '/api/auth/refresh-token'
  ];

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let displayLoadingBar = true;

    for (const skipUrl of this.skipUrls) {
      if (new RegExp(skipUrl).test(request.url)) {
        displayLoadingBar = false;
        break;
      }
    }

    if (displayLoadingBar) {
      if (this.activeRequests === 0) {
        this.loadingService.startLoading();
      }
      this.activeRequests++;

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingService.stopLoading();
          }
        })
      )
    } else {
      return next.handle(request);
    }
  }
}