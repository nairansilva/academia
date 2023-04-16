import { UsuariosService } from './../../../usuarios/shared/usuarios.service';
import { UsuarioTreinosService } from 'src/app/pages/usuario-treinos/shared/usuario-treino.service';
import { TreinosService } from './../../../treinos/shared/treinos.service';
import { Component, OnInit } from '@angular/core';
import { TreinoInterface } from 'src/app/pages/treinos/shared/treinos.model';
import { AlunosInterface } from 'src/app/pages/usuarios/shared/alunos.model';

@Component({
  selector: 'app-treinamentos',
  templateUrl: './treinamentos.component.html',
  styleUrls: ['./treinamentos.component.scss'],
})
export class TreinamentosComponent implements OnInit {
  emailUsuario = '';
  aluno: AlunosInterface;
  treinos: TreinoInterface[];
  constructor(
    private usuarioTreinosService: UsuarioTreinosService,
    private usuariosService: UsuariosService
  ) {
    const jsonUsuario = JSON.parse(String(localStorage.getItem('user')));
    this.emailUsuario = jsonUsuario.email;
  }

  ngOnInit() {
    this.usuariosService.getByEmail(this.emailUsuario).subscribe({
      next: (res) => ((this.aluno = res[0]), console.log(this.aluno.id)),
      error: (error) => console.log(error),
    });
  }

  buscaTreinoAluno(){
    // this.
  }
}
