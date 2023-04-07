import { TreinosFormComponent } from './treinos-form/treinos-form.component';
import { TreinosComponent } from './treinos/treinos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TreinosComponent,
  },
  { path: 'form', component: TreinosComponent },
  { path: 'form/:id', component: TreinosFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreinosRoutingModule { }
