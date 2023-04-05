import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
