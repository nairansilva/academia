import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login/shared/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // if (this.loginService.isLoggedIn !== true) {
    //   this.router.navigate(['login']);
    // }
    if (!this.loginService.isUserAdmin){
      return false;
    }
    return true;
  }
  constructor(public loginService: LoginService, public router: Router) {}
}
