import { Component, Input, OnInit } from '@angular/core';
import { TreinoInterface } from '../../treinos/shared/treinos.model';
import { UsuarioTreinosService } from '../shared/usuario-treino.service';
import { TreinosService } from '../../treinos/shared/treinos.service';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { UsuarioTreinosExerciciosService } from '../shared/usuario-treino-exercicios.service';
import { UsuarioTreinoExerciciosInterface } from '../shared/usuario-treinos-exercicios.model';
import { UsuarioTreinoInterface } from '../shared/usuario-treinos.model';

@Component({
  selector: 'app-usuario-treinos-exercicios',
  templateUrl: './usuario-treinos-exercicios.component.html',
  styleUrls: ['./usuario-treinos-exercicios.component.scss'],
})
export class UsuarioTreinosExerciciosComponent implements OnInit {
  loading: any;
  treinosSelecionados: UsuarioTreinoExerciciosInterface[] = [];
  listaDeTreinos: UsuarioTreinoExerciciosInterface[] = [];
  usuarioXTreino: UsuarioTreinoInterface;
  buscaDeTreinoFinalizada = false;

  constructor(
    private usuarioTreinosService: UsuarioTreinosService,
    private treinosService: TreinosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioTreinosExerciciosService: UsuarioTreinosExerciciosService
  ) {}

  ngOnInit() {
    this.usuarioXTreino = JSON.parse(
      String(sessionStorage.getItem('usuarioXTreino'))
    );
    this.listaTreinos();
  }

  async listaTreinos() {
    await this.carregaTreinos();
  }

  async carregaTreinos() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Treinos...',
    });

    this.loading.present();

    this.usuarioTreinosExerciciosService
      .getAlunoTreinosExercicioByAlunoAETreino(
        this.usuarioXTreino.idUsuario,
        this.usuarioXTreino.id
      )
      .subscribe({
        next: (res) => {
          this.listaDeTreinos = res;
          console.log(res);
          this.buscaDeTreinoFinalizada = true;
          if (this.loading) this.loading.dismiss();
        },
        error: (error) => {
          if (this.loading) this.loading.dismiss();
        },
      });
  }

  novoExercicio() {
    this.router.navigate([
      `admin/usuariotreinos/${this.usuarioXTreino.idUsuario}/form/${this.usuarioXTreino.id}/exercicio/list/form`,
    ]);
  }

  voltar() {
    this.router.navigate([
      `admin/usuariotreinos/${this.usuarioXTreino.idUsuario}`,
    ]);
  }
}
