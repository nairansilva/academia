import { LoginInterface } from './login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { map, tap, Observable, of } from 'rxjs';
import { LoginSuccessInterface } from './loginSuccess.model';
import {
  Auth,
  User,
  user,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userData = {};
  private token = '';

  user$: Observable<any>;
  constructor(protected httpClient: HttpClient, private angularFireAuth: Auth) {
    this.user$ = user(angularFireAuth);

    this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      // console.log('tete', aUser);
      localStorage.setItem('user', JSON.stringify(user));
    });

    // this.AngularFireAuth

    // this.angularFireAuth.authState.subscribe((user) => {
    //   console.log('opa', user);
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user')!);
    //   } else {
    //     localStorage.setItem('user', 'null');
    //     JSON.parse(localStorage.getItem('user')!);
    //   }
    // });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  login(login: LoginInterface): Promise<any> {
    return signInWithEmailAndPassword(
      this.angularFireAuth,
      login.email,
      login.password
    );
    // return of({ name: '', jwtToken: '' });
  }

  logout(): void {
    sessionStorage.removeItem('tokenPrinterControl');
    sessionStorage.removeItem('emailUser');
    signOut(this.angularFireAuth);
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
