import { Component, Input, OnInit } from '@angular/core';
import { UsuarioTreinoExerciciosInterface } from '../shared/usuario-treinos-exercicios.model';
import { Router } from '@angular/router';
import { UsuarioTreinoInterface } from '../shared/usuario-treinos.model';

@Component({
  selector: 'app-usuario-treinos-exercicios-card',
  templateUrl: './usuario-treinos-exercicios-card.component.html',
  styleUrls: ['./usuario-treinos-exercicios-card.component.scss'],
})
export class UsuarioTreinosExerciciosCardComponent implements OnInit {
  @Input() exercicio: UsuarioTreinoExerciciosInterface;
  constructor(private router:Router) {}
  usuarioXTreino: UsuarioTreinoInterface;
  ngOnInit() {
    this.usuarioXTreino = JSON.parse(
      String(sessionStorage.getItem('usuarioXTreino'))
    );
  }

  editar() {
    this.router.navigate([
      `admin/usuariotreinos/${this.usuarioXTreino.idUsuario}/form/${this.usuarioXTreino.id}/exercicio/list/form/${this.exercicio.id}`,
    ]);
  }

  excluir() {}
}
