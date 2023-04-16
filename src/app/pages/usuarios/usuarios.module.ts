import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuariosCardComponent } from './usuarios-card/usuarios-card.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    UsuariosComponent,
    UsuariosCardComponent,
    UsuariosFormComponent,
  ],
  imports: [CommonModule, SharedModule, UsuariosRoutingModule],
})
export class UsuariosModule {}
