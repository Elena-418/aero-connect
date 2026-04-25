import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
//si no está autenticado ok sino va al login. El parse este crea una url tree, en vez de navigate parse
export const authGuard: CanActivateFn = (route, state) => {
const auth = inject(AuthService);
const router=inject(Router)
return auth.isAuthenticated()? true: router.parseUrl("login");
};