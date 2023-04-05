import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagamentosRoutingModule } from './treinos-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    PagamentosRoutingModule
  ]
})
export class PagamentosModule { }
