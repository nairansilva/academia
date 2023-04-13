import { Router } from '@angular/router';
import { TreinosService } from './../shared/treinos.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getDownloadURL } from '@angular/fire/storage';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-treinos-card',
  templateUrl: './treinos-card.component.html',
  styleUrls: ['./treinos-card.component.scss'],
})
export class TreinosCardComponent implements OnInit {
  @Input() treino: any;
  @Output() registroExcluido = new EventEmitter();

  constructor(
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
        this.deletarUsuario();
      },
    },
  ];

  imagem = './../../../../assets/imgs/avatar-do-usuario.png';

  ngOnInit() {
    this.treinosService
      .getPictures(this.treino.id)
      .then((res) => {
        const imgProfile = res.items.filter((item: any) =>
          item.name.includes(this.treino.id)
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

  editar() {
    // console.log(this.treino)
    this.router.navigate(['treinos/form/', this.treino.id]);
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

  async deletarUsuario() {
    const loading = await this.loadingCtrl.create({
      message: 'Excluíndo Treino...',
    });

    loading.present();
    await this.treinosService.deleteTreino(this.treino.id);
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
