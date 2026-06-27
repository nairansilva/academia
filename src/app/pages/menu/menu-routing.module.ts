import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
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
          import('../usuarios/usuarios.module').then((m) => m.UsuariosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'usuarioavaliacao',
        loadChildren: () =>
          import('../usuario-avaliacao/usuario-avaliacao.module').then((m) => m.UsuarioAvaliacaoModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
