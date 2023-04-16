import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreinamentosComponent } from './treinamentos/treinamentos.component';
import { TreinamentosRoutingModule } from './treinamentos-routing.module';
import { TreinosModule } from '../../treinos/treinos.module';

@NgModule({
  declarations: [TreinamentosComponent],
  imports: [CommonModule, TreinamentosRoutingModule, TreinosModule],
})
export class TreinamentosModule {}
