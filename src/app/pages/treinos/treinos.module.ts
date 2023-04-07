import { TreinosFormComponent } from './treinos-form/treinos-form.component';
import { TreinosComponent } from './treinos/treinos.component';
import { TreinosCardComponent } from './treinos-card/treinos-card.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreinosRoutingModule } from './treinos-routing.module';

@NgModule({
  declarations: [TreinosCardComponent, TreinosComponent, TreinosFormComponent],
  imports: [CommonModule, SharedModule, TreinosRoutingModule],
})
export class TreinosModule {}
