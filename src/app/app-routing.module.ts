import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './core/login/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuModule),
      ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
