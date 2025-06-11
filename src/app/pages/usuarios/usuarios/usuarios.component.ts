import { Router } from '@angular/router';
import { StorageService } from './../../../shared/services/storage.service';
import { UsuariosService } from './../shared/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { AlunosInterface } from '../shared/alunos.model';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent {
  constructor(
    private usuariosService: UsuariosService,
    private storageService: StorageService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  lastDoc: any = null;
  imagem = '';
  pagina = 1;
  filtro = '';
  loading: any;
  usuarios: AlunosInterface[] = [];

  ngOnInit() {
    console.log('to no usuarios')
    // this.listaAlunos();
  }

  ionViewWillEnter() {
    this.filtro = '';
    this.pagina = 1;
    this.lastDoc = null;
    this.usuarios = [];
    this.listaAlunos();
  }

  novoUsuario() {
    this.router.navigate(['admin//usuarios/form']);
  }

  listaAlunos() {
    this.usuariosService
      .getAlunos(this.filtro, this.lastDoc)
      .subscribe({
        next: (res: any) => {
          if (res.length) {
            this.lastDoc = res[res.length - 1]['__snapshot']; // snapshot do último doc
          }
          this.pagina === 1
            ? (this.usuarios = res)
            : (this.usuarios = this.usuarios.concat(res));
          if (this.loading) this.loading.dismiss();
        },
        error: (error) => {
          console.error(error);
          if (this.loading) this.loading.dismiss();
        },
      });
  }

  async buscaAlunos(busca: any) {
    const valorBusca = (busca.detail.value || '').trim();

    this.filtro = valorBusca;
    this.lastDoc = null;
    this.pagina = 1;
    this.usuarios = [];

    this.loading = await this.loadingCtrl.create({
      message: this.filtro ? 'Buscando Usuários...' : 'Carregando todos os usuários...',
    });

    await this.loading.present();

    this.listaAlunos();
  }

  onIonInfinite(ev: any) {
    this.pagina++;
    this.listaAlunos();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async registroExcluido() {
    this.loading = await this.loadingCtrl.create({ message: 'Atualizando Usuários...' });
    await this.loading.present();
    this.usuarios = [];
    this.lastDoc = null;
    this.pagina = 1;
    this.listaAlunos();
  }
}
