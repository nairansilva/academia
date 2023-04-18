import { UsuarioAvaliacaoService } from './../shared/usuario-avaliacao.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-usuario-avaliacao-card',
  templateUrl: './usuario-avaliacao-card.component.html',
  styleUrls: ['./usuario-avaliacao-card.component.scss'],
})
export class UsuarioAvaliacaoCardComponent implements OnInit {
  @Input() usuarioNome: string;
  @Input() avalicao: UsuarioAvaliacaoInterface;
  @Output() registroExcluido = new EventEmitter();
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioAvaliacaoService: UsuarioAvaliacaoService
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
        this.deletarAvaliacao();
      },
    },
  ];

  ngOnInit() {}

  editar() {
    this.router.navigate([
      `admin/usuarioavaliacao/${this.avalicao.idUsuario}/form/${this.avalicao.id}`,
    ]);
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message:
        'Confirma Exclusão da avaliação? Uma vez exluído, não há como recuperá-lo.',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  async deletarAvaliacao() {
    const loading = await this.loadingCtrl.create({
      message: 'Excluíndo Usuário...',
    });

    loading.present();
    await this.usuarioAvaliacaoService.deleteUsuarioAvalicao(this.avalicao.id);
    loading.dismiss();
    const toast = await this.toastController.create({
      message: 'Registro Exluído com Sucesso!',
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    await toast.present();

    this.registroExcluido.emit();
  }
}
