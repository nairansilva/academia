import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioAvaliacaoComponent } from './usuarios-avaliacao/usuario-avaliacao.component';
import { UsuarioAvaliacaoFormComponent } from './usuario-avaliacao-form/usuario-avaliacao-form.component';
import { UsuarioAvaliacaoCardComponent } from './usuario-avaliacao-card/usuario-avaliacao-card.component';
import { UsuarioAvaliacaoRoutingModule } from './usuario-avaliacao-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioAvaliacaoPollockComponent } from './usuario-avaliacao-pollock/usuario-avaliacao-pollock.component';
import { UsuarioAvaliacaoComparacaoComponent } from './usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component';
import { UsuarioAvaliacaoForcaComponent } from './usuario-avaliacao-forca/usuario-avaliacao-forca.component';

@NgModule({
  declarations: [
    UsuarioAvaliacaoCardComponent,
    UsuarioAvaliacaoComponent,
    UsuarioAvaliacaoFormComponent,
    UsuarioAvaliacaoPollockComponent,
    UsuarioAvaliacaoComparacaoComponent,
    UsuarioAvaliacaoForcaComponent,
  ],
  imports: [CommonModule, UsuarioAvaliacaoRoutingModule, SharedModule],
})
export class UsuarioAvaliacaoModule {}
