import { LoginInterface } from './login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { map, tap, Observable, of } from 'rxjs';
import { LoginSuccessInterface } from './loginSuccess.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected httpClient: HttpClient) {}

  private token = '';

  login(login: LoginInterface): Observable<LoginSuccessInterface> {
    return of({ name: '', jwtToken: '' });
  }

  logout(): void {
    sessionStorage.removeItem('tokenPrinterControl');
    sessionStorage.removeItem('emailUser');
  }

  protected setToken(loginSucces: LoginSuccessInterface): void {
    console.log(loginSucces);
    sessionStorage.setItem('tokenPrinterControl', loginSucces.jwtToken);
    sessionStorage.setItem('emailUser', loginSucces.name);
  }

  getToken(): string {
    return sessionStorage.getItem('tokenPrinterControl')
      ? String(sessionStorage.getItem('tokenPrinterControl'))
      : '';
  }
}
