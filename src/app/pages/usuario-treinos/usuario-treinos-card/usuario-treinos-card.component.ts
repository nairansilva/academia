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
  treinos:TreinoInterface[];

  constructor(
    private usuarioTreinosService: UsuarioTreinosService,
    private treinosService: TreinosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
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

  ngOnInit() {}

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
        this.treinos = res;
        this.setOpen(true);
        if (this.loading) this.loading.dismiss();
      },
      error: (error) => {
        console.error(error);
        this.loading.dismiss();
      },
    });
  }

  setOpen(option: boolean) {
    this.isModalOpen = option;
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
