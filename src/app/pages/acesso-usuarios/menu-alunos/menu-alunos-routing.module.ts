import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MenuAlunosComponent } from './menu-alunos/menu-alunos.component';

const routes: Routes = [
  {
    path: '',
    component: MenuAlunosComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then(
            (m) => m.PerfilModule
          ),
      },
      {
        path: 'treinamentos',
        loadChildren: () =>
          import('../treinamentos/treinamentos.module').then(
            (m) => m.TreinamentosModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAlunosRoutingModule {}
