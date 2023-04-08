import { TreinosService } from './../shared/treinos.service';
import { Router } from '@angular/router';
import { TreinoInterface } from './../shared/treinos.model';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.scss'],
})
export class TreinosComponent implements OnInit {
  treinos: TreinoInterface[] = [];
  constructor(
    private router: Router,
    private treinosService: TreinosService,
    private loadingCtrl: LoadingController
  ) {}

  filtro = '';
  pagina = 1;
  loading: any;

  ionViewWillEnter() {
    this.treinos = [];
    this.pagina = 1;
    this.listaTreinos();
  }

  ngOnInit() {
    // this.treinos =[]
    // this.listaTreinos();
  }

  async buscaTreinos(busca: any) {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Usuários...',
    });

    this.loading.present();
    this.filtro = busca.detail.value;
    this.treinos = [];
    this.listaTreinos();
  }

  novoTreino() {
    this.router.navigate(['/treinos/form']);
  }

  listaTreinos() {
    const lastName = this.treinos[this.treinos.length - 1]
      ? this.treinos[this.treinos.length - 1].nome
      : '';
    this.treinosService
      .getTreinos(this.filtro, this.pagina, lastName)
      .subscribe({
        next: (res) => {
          this.pagina === 1
            ? (this.treinos = this.treinos = res)
            : (this.treinos = this.treinos.concat(res));
          if (this.loading) this.loading.dismiss();
        },
        error: (error) => {
          console.error(error);
          this.loading.dismiss();
        },
      });
  }

  onIonInfinite(ev: any) {
    this.pagina++;
    this.listaTreinos();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async registroExcluido() {
    this.loading = await this.loadingCtrl.create({
      message: 'Atualizando Treinos...',
    });

    this.loading.present();
    this.treinos = [];
    this.listaTreinos();
  }
}
