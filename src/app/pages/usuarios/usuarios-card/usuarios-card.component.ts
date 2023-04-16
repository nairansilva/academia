import { UsuariosService } from './../shared/usuarios.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getDownloadURL } from 'firebase/storage';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-usuarios-card',
  templateUrl: './usuarios-card.component.html',
  styleUrls: ['./usuarios-card.component.scss'],
})
export class UsuariosCardComponent implements OnInit {
  @Input() usuario: any;
  @Output() registroExcluido = new EventEmitter();

  constructor(
    private usuariosService: UsuariosService,
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
        this.deletarUsuario();
      },
    },
  ];

  imagem = './../../../../assets/imgs/avatar-do-usuario.png';

  ngOnInit() {
    this.usuariosService
      .getPictures(this.usuario.id)
      .then((res) => {
        const imgProfile = res.items.filter((item: any) =>
          item.name.includes(this.usuario.id)
        );
        if (imgProfile.length > 0) {
          const url = getDownloadURL(imgProfile[0]);
          url.then((res) => {
            this.imagem = res;
          });
        }
      })
      .catch((error) => console.error(error));
  }

  async openPhone() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Confirma Ligar para o usuário?',
      buttons: [
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
            window.open('tel:' + this.usuario.telefone);
          },
        },
      ],
    });

    await alert.present();
  }
  editar() {
    this.router.navigate(['admin/usuarios/form/', this.usuario.id]);
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message:
        'Confirma Exclusão do Usuário? Uma vez exluído, não há como recuperá-lo.',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  async deletarUsuario() {
    const loading = await this.loadingCtrl.create({
      message: 'Excluíndo Usuário...',
    });

    loading.present();
    await this.usuariosService.deleteAluno(this.usuario.id);
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

  abreAvaliacao() {
    this.router.navigate(['admin/usuarioavaliacao'], {
      queryParams: { usuario: this.usuario.nome, id: this.usuario.id },
    });
  }
}
