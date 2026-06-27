import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UsuariosService } from './../shared/usuarios.service';
import { AlunosInterface } from '../shared/alunos.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnDestroy {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
  ) {
    this.searchSubject.pipe(debounceTime(1000)).subscribe(termo => {
      this.aplicarFiltro(termo);
      this.buscando = false;
    });
  }

  private todosAlunos: AlunosInterface[] = [];
  usuarios: AlunosInterface[] = [];
  buscando = false;

  private searchSubject = new Subject<string>();

  ionViewWillEnter() {
    this.carregarTodos();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
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
    const termo = (busca.detail.value || '').trim();
    this.buscando = true;
    this.searchSubject.next(termo);
  }

  private aplicarFiltro(termo: string) {
    const t = termo.toLowerCase();
    this.usuarios = t
      ? this.todosAlunos.filter(u => u.nome?.toLowerCase().includes(t))
      : this.todosAlunos;
  }

  registroExcluido() {
    this.carregarTodos();
  }
}
