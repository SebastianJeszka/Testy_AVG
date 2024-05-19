import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const OIDC_FLOW = new HttpContextToken(() => true);
export const EXTERNAL_DATA_REQUEST_FLOW = new HttpContextToken(() => false);
@Injectable()
export class RedirectInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<Request>, next: HttpHandler): Observable<HttpEvent<Response>> {
    let url = request.url;

    if (request.context.get(EXTERNAL_DATA_REQUEST_FLOW)) {
      return next.handle(request);
    }

    if (url.includes('/assets/')) {
      return next.handle(request);
    }

    if (url.includes(environment.terytApiUrl)) {
      const req = request.clone({ url });
      return next.handle(req);
    }

    const req = request.clone({
      url: url,
      withCredentials: true
    });

    return next.handle(req);
  }
}
