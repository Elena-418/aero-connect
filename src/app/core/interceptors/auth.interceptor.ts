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
  // si voy a operar sobre la request hago un clone
  const auth = inject(AuthService);
//comprueba si estas loggeado, si lo estas clona la request y le añade el header de authorization con el token, si no lo estas no hace nada y la request sigue su curso normal
  if(auth.isAuthenticated()){
    const r = req.clone({
      setHeaders : {
        "Authorization": "Bearer " + auth.getToken() 
      }
    })
    return next(r);
  }
  //pasarlo al siguiente pipe o interceptor, esto es un pasamanos, lo hay que poner siempre ya que lo pilla el http client par hacer la llamada
  return next(req);

  // si voy a operar sobre la response opero sobre la misma next


  // return next(req);
  // no me subscribo jamas aca, los componentes reciben este observable y se subscriben
  // return next(req).pipe( operadores que quiera como el tap ());
};