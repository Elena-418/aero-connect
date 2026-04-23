import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  let newReq = req;

  if (authToken) {
    newReq = req.clone({
      headers: req.headers.set('X-Authentication-Token', authToken),
    });
  }

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error client: ${error.error.message}`;
      } else {
        errorMessage = `Error server: ${error.status}`;
      }

      console.error(errorMessage);
      return throwError(() => error);
    })
  );
};