import { TreinoInterface } from './../../treinos/shared/treinos.model';
import { TreinosService } from './../../treinos/shared/treinos.service';
import { UsuarioTreinoInterface } from './../shared/usuario-treinos.model';
import { UsuarioTreinosService } from './../shared/usuario-treino.service';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { take, finalize } from 'rxjs/operators';
import { UsuarioTreinosExerciciosService } from '../shared/usuario-treino-exercicios.service';
import { UsuarioTreinoExerciciosInterface } from '../shared/usuario-treinos-exercicios.model';
import { TreinoSelecionadosInterface } from '../shared/treinos-selecionados.model';

@Component({
  selector: 'app-usuario-treinos-card',
  templateUrl: './usuario-treinos-card.component.html',
  styleUrls: ['./usuario-treinos-card.component.scss'],
})
export class UsuarioTreinosCardComponent implements OnInit, OnDestroy {
  @Input() usuarioXTreino: UsuarioTreinoInterface;
  @Output() registroExcluido = new EventEmitter();
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    // console.log('opa');
    this.setOpen(false);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.setOpen(false);
  }

  isModalOpen = false;
  loading: any;
  listaDeTreinos: TreinoInterface[];
  treinosSelecionados: UsuarioTreinoExerciciosInterface[] = [];

  constructor(
    private usuarioTreinosService: UsuarioTreinosService,
    private treinosService: TreinosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioTreinosExerciciosService: UsuarioTreinosExerciciosService,
    private modalController: ModalController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.setOpen(false);
    });
  }

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

  async ngOnInit() {
    //   const modalState = {
    //     modal : true,
    //     desc : 'fake state for our modal'
    // };
    // history.pushState(modalState,'');
  }

  ngOnDestroy() {
    // if (window.history.state.modal) {
    //   history.back();
    // }
  }

  editar() {
    this.router.navigate([
      `admin/usuariotreinos/${this.usuarioXTreino.idUsuario}/form`,
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
        this.listaDeTreinos = res.map((obj) => ({
          ...obj,
          check: false,
        }));
        this.setOpen(true);
        if (this.loading) this.loading.dismiss();
        console.log(this.listaDeTreinos);
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
        .getAlunoTreinosExercicioByAlunoAETreino(
          this.usuarioXTreino.idUsuario,
          this.usuarioXTreino.id
        )
        .subscribe({
          next: (res) => {
            this.treinosSelecionados = res;
            res.map((treinoXAluno) => {
              this.listaDeTreinos.filter((treinoFiltrado, index) => {
                if (treinoFiltrado.id == treinoXAluno.idExercicio) {
                  this.listaDeTreinos[index].check = true;
                } else {
                  // this.listaDeTreinos[index].check = false;
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

  async marcaTreino(ev: any, treino: TreinoInterface) {
    if (ev.detail.checked) {
      let index = 0;
      this.treinosSelecionados.filter((treinoSelecionado) => {
        if (treinoSelecionado.idExercicio === treino.id) {
          index = 1;
        }
      });

      if (index === 0) {
        const exercicio = {
          id: '',
          idUsuario: this.usuarioXTreino.idUsuario,
          idExercicio: treino.id,
          idTreino: this.usuarioXTreino.id,
        };
        this.treinosSelecionados.push(exercicio);
        await this.salvarExercicioTreino(exercicio);
      }
      // this.treinosSelecionados = [];
    } else {
      let index = 0;
      this.treinosSelecionados.filter((treinoSelecionado) => {
        if (treinoSelecionado.idExercicio === treino.id) {
          index = 1;
        }
      });

      if (index >= 0) {
        // console.log(this.treinosSelecionados[index-1])
        this.deletaExercicioTreino(this.treinosSelecionados[index - 1].id);
        // this.treinosSelecionados.splice(index, 1);
      }
      // console.log(index, this.treinosSelecionados);
    }
  }

  async salvarExercicioTreino(exercicio: UsuarioTreinoExerciciosInterface) {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando Treino...',
    });

    await loading.present();

    //ToDo: Criar um array com os itens marcador originais. O que for desmacado, eu deleto.

    const treinoIncluido =
      await this.usuarioTreinosExerciciosService.postAlunoTreinosExercicios(
        exercicio
      );
    console.log('listaDeTreinos', this.listaDeTreinos);
    console.log('exercicio', exercicio);

    console.log(treinoIncluido);

    loading.dismiss();
    this.treinosSelecionados = [];
    const toast = await this.toastController.create({
      message: 'Treino Atualizado com Sucesso!',
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    await toast.present();
    // this.setOpen(false);
  }

  async deletaExercicioTreino(id: string) {
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
      await this.usuarioTreinosExerciciosService.deleteAlunoTreinosExercicios(
        id
      );
    });

    loading.dismiss();
    this.treinosSelecionados = [];
    const toast = await this.toastController.create({
      message: 'Treino Atualizado com Sucesso!',
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    await toast.present();
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
