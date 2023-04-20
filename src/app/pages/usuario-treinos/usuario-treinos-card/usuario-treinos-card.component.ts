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
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
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
    sessionStorage.removeItem('usuarioXTreino')
    sessionStorage.setItem('usuarioXTreino', JSON.stringify(this.usuarioXTreino))
    this.router.navigate([
      `admin/usuariotreinos/${this.usuarioXTreino.idUsuario}/form/${this.usuarioXTreino.id}/exercicios`
    ]);
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
