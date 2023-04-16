import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreinamentosComponent } from './treinamentos/treinamentos.component';

const routes: Routes = [
  {
    path: '',
    component: TreinamentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreinamentosRoutingModule {}
