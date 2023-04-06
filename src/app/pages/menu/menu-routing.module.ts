import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { LoginComponent } from 'src/app/core/login/login/login.component';
import { MenuComponent } from './menu/menu.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./../usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'treinos',
        loadChildren: () =>
          import('./../treinos/treinos.module').then((m) => m.TreinosModule),
      },
      {
        path: 'pagamentos',
        loadChildren: () =>
          import('./../pagamentos/pagamentos.module').then(
            (m) => m.PagamentosModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
