import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  canActivate(
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('opa')
    // console.log('não foi')
    // this.router.navigate(['/login']);

    return true;
  }
  constructor(private router: Router) { }

}
