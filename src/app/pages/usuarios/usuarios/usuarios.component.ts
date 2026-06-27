import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from './../shared/usuarios.service';
import { AlunosInterface } from '../shared/alunos.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
  ) {}

  private todosAlunos: AlunosInterface[] = [];
  usuarios: AlunosInterface[] = [];

  ionViewWillEnter() {
    this.carregarTodos();
  }

  novoUsuario() {
    this.router.navigate(['admin//usuarios/form']);
  }

  private carregarTodos() {
    this.usuariosService.getAllAlunos().subscribe({
      next: res => {
        this.todosAlunos = res;
        this.usuarios = res;
      },
      error: err => console.error(err),
    });
  }

  buscaAlunos(busca: any) {
    const termo = (busca.detail.value || '').trim().toLowerCase();
    this.usuarios = termo
      ? this.todosAlunos.filter(u => u.nome?.toLowerCase().includes(termo))
      : this.todosAlunos;
  }

  registroExcluido() {
    this.carregarTodos();
  }
}
