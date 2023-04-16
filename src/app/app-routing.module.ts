import { ResetPasswordComponent } from './core/login/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './core/login/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/acesso-usuarios/menu-alunos/menu-alunos.module').then((m) => m.MenuAlunosModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
