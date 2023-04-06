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
export class UsuariosComponent implements OnInit {
  constructor(
    private usuariosService: UsuariosService,
    private storageService: StorageService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  imagem = '';
  pagina = 1;
  filtro = '';
  loading: any;
  usuarios: AlunosInterface[] = [];

  ngOnInit() {
    this.listaAlunos();
  }

  novoUsuario() {
    console.log('oi');
    this.router.navigate(['/usuarios/form']);
  }

  listaAlunos() {
    const lastName = this.usuarios[this.usuarios.length - 1]
      ? this.usuarios[this.usuarios.length - 1].nome
      : '';
    this.usuariosService.getAlunos(this.filtro, this.pagina, lastName).subscribe({
      next: (res) => {
        console.log('o que chegou', res);
        this.usuarios = this.usuarios.concat(res);
        if (this.loading) this.loading.dismiss();
      },
      error: (error) => {
        console.error(error);
        this.loading.dismiss();
      },
    });
  }

  async buscaAlunos(busca: any) {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Usuários...',
    });

    this.loading.present();
    this.filtro = busca.detail.value;
    this.usuarios = [];
    this.listaAlunos();
  }

  onIonInfinite(ev: any) {
    this.pagina++;
    this.listaAlunos();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }
}
