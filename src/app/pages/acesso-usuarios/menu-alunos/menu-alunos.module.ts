import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuAlunosComponent } from './menu-alunos/menu-alunos.component';
import { MenuAlunosRoutingModule } from './menu-alunos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MenuAlunosComponent],
  imports: [CommonModule, MenuAlunosRoutingModule, SharedModule],
})
export class MenuAlunosModule {}
