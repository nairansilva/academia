import { TreinoInterface } from './../../treinos/shared/treinos.model';
import { TreinosService } from './../../treinos/shared/treinos.service';
import { UsuarioTreinoInterface } from './../shared/usuario-treinos.model';
import { UsuarioTreinosService } from './../shared/usuario-treino.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { take, finalize } from 'rxjs/operators';
import { UsuarioTreinosExerciciosService } from '../shared/usuario-treino-exercicios.service';
import { UsuarioTreinoExerciciosInterface } from '../shared/usuario-treinos-exercicios.model';

@Component({
  selector: 'app-usuario-treinos-card',
  templateUrl: './usuario-treinos-card.component.html',
  styleUrls: ['./usuario-treinos-card.component.scss'],
})
export class UsuarioTreinosCardComponent implements OnInit {
  @Input() usuarioXTreino: UsuarioTreinoInterface;
  @Output() registroExcluido = new EventEmitter();

  isModalOpen = false;
  loading: any;
  treinos: TreinoInterface[];
  treinosSelecionados: UsuarioTreinoExerciciosInterface[] = [];

  constructor(
    private usuarioTreinosService: UsuarioTreinosService,
    private treinosService: TreinosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioTreinosExerciciosService: UsuarioTreinosExerciciosService
  ) {}

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('cancelei');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.deletarTreino();
      },
    },
  ];

  async ngOnInit() {}

  editar() {
    this.router.navigate([
      `usuariotreinos/${this.usuarioXTreino.idUsuario}/form`,
      this.usuarioXTreino.id,
    ]);
  }

  async listaTreinos() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Treinos...',
    });

    this.loading.present();

    this.treinosService.getTreinos().subscribe({
      next: (res) => {
        this.treinos = res.map((obj) => ({ ...obj, check: false }));
        this.setOpen(true);
        if (this.loading) this.loading.dismiss();
      },
      error: (error) => {
        console.error(error);
        this.loading.dismiss();
      },
    });
  }

  async setOpen(option: boolean) {
    if (option) {
      this.loading = await this.loadingCtrl.create({
        message: 'Buscando Treinos...',
      });

      this.loading.present();

      this.usuarioTreinosExerciciosService
        .getAlunoTreinosExercicioByAluno(this.usuarioXTreino.idUsuario)
        .subscribe({
          next: (res) => {
            this.treinosSelecionados = res;
            res.map((treinoXAluno) => {
              this.treinos.filter((treinoFiltrado, index) => {
                if (treinoFiltrado.id == treinoXAluno.idExercicio) {
                  this.treinos[index].check = true;
                } else {
                  // this.treinos[index].check = false;
                }
              });
            });
            // console.log(this.treinosSelecionados);
            if (this.loading) this.loading.dismiss();
          },
          error: (error) => {
            if (this.loading) this.loading.dismiss();
          },
        });
    }
    this.isModalOpen = option;
  }

  validaMarcacao(treino: TreinoInterface): boolean {
    let index = 0;
    this.treinosSelecionados.filter((treinoSelecionado) => {
      if (treinoSelecionado.idExercicio === treino.id) {
        index = 1;
      }
    });

    if (index >= 0) {
      return true;
    }
    // console.log(index, this.treinosSelecionados);
    return false;
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message:
        'Confirma Exclusão do Treino? Uma vez exluído, não há como recuperá-lo.',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  marcaTreino(ev: any, treino: TreinoInterface) {
    if (ev.detail.checked) {
      let index = 0;
      this.treinosSelecionados.filter((treinoSelecionado) => {
        if (treinoSelecionado.idExercicio === treino.id) {
          index = 1;
        }
      });

      if (index === 0) {
        this.treinosSelecionados.push({
          idUsuario: this.usuarioXTreino.idUsuario,
          idExercicio: treino.id,
          idTreino: this.usuarioXTreino.id,
          id: '',
        });
      }
    } else {
      let index = 0;
      this.treinosSelecionados.filter((treinoSelecionado) => {
        if (treinoSelecionado.idExercicio === treino.id) {
          index = 1;
        }
      });

      if (index >= 0) {
        this.treinosSelecionados.splice(index, 1);
      }
      // console.log(index, this.treinosSelecionados);
    }
  }

  async salvar() {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando Treino...',
    });

    await loading.present();

    //ToDo: Criar um array com os itens marcador originais. O que for desmacado, eu deleto.

    this.treinosSelecionados.forEach(async (treinoSelecionado) => {
      const exercicio = {
        id: '',
        idUsuario: treinoSelecionado.idUsuario,
        idExercicio: treinoSelecionado.idExercicio,
        idTreino: this.usuarioXTreino.id,
      };
      await this.usuarioTreinosExerciciosService.postAlunoTreinosExercicios(
        exercicio
      );
    });

    loading.dismiss();
    this.treinosSelecionados = [];
    const toast = await this.toastController.create({
      message: 'Treino Salvo com Sucesso!',
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    await toast.present();
    this.setOpen(false);
  }

  async deletarTreino() {
    const loading = await this.loadingCtrl.create({
      message: 'Excluíndo Treino...',
    });

    loading.present();
    await this.usuarioTreinosService.deleteAlunoTreinos(this.usuarioXTreino.id);
    loading.dismiss();
    const toast = await this.toastController.create({
      message: 'Treino Exluído com Sucesso!',
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    await toast.present();

    this.registroExcluido.emit();
  }
}
