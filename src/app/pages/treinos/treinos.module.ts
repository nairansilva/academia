import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreinosRoutingModule } from './treinos-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, TreinosRoutingModule]
})
export class TreinosModule {}
