import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { UsuarioAvaliacaoComponent } from './usuarios-avaliacao/usuario-avaliacao.component';
import { UsuarioAvaliacaoFormComponent } from './usuario-avaliacao-form/usuario-avaliacao-form.component';
import { UsuarioAvaliacaoCardComponent } from './usuario-avaliacao-card/usuario-avaliacao-card.component';
import { UsuarioAvaliacaoRoutingModule } from './usuario-avaliacao-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioAvaliacaoPollockComponent } from './usuario-avaliacao-pollock/usuario-avaliacao-pollock.component';
import { UsuarioAvaliacaoFotosComponent } from './usuario-avaliacao-fotos/usuario-avaliacao-fotos.component';
import { UsuarioAvaliacaoComparacaoComponent } from './usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component';

@NgModule({
  declarations: [
    UsuarioAvaliacaoCardComponent,
    UsuarioAvaliacaoComponent,
    UsuarioAvaliacaoFormComponent,
    UsuarioAvaliacaoPollockComponent,
    UsuarioAvaliacaoFotosComponent,
    UsuarioAvaliacaoComparacaoComponent
  ],
  providers:[DecimalPipe],
  imports: [CommonModule, UsuarioAvaliacaoRoutingModule, SharedModule],
})
export class UsuarioAvaliacaoModule {}
