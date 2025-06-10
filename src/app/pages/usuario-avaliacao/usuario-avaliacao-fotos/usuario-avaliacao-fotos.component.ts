import { StorageService } from 'src/app/shared/services/storage.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { PhotoService } from 'src/app/shared/services/PhotoService.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-usuario-avaliacao-fotos',
  templateUrl: './usuario-avaliacao-fotos.component.html',
  styleUrls: ['./usuario-avaliacao-fotos.component.scss'],
})
export class UsuarioAvaliacaoFotosComponent implements OnInit {
  @Input() idAvaliacao: string | null;

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.setOpen(false);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.setOpen(false);
  }

  photoSelected: string;
  modalAberto = false;
  listPhotos: any[] = [];
  loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    public photoService: PhotoService,
    private storageService: StorageService,
    private platform: Platform,
    private alertCtrl: AlertController,

  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.setOpen(false);
    });
  }

  async ngOnInit() {
    this.listaPhotos();
  }

  setOpen(open: boolean) {
    this.modalAberto = open;
  }

  async cliquePhoto(photo: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Deseja realmente excluir esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            this.loading = await this.loadingCtrl.create({
              message: 'Excluindo foto...',
            });
            await this.loading.present();

            this.photoSelected = photo;

            await this.storageService.deletePicture(
              'avaliacao',
              String(this.idAvaliacao),
              photo.name
            );

            await this.fecharLoading();
            await this.listaPhotos();
          }
        }
      ]
    });

    await alert.present();
  }

  async listaPhotos() {
    this.listPhotos = [];

    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Fotos...',
    });
    await this.loading.present();

    await new Promise(resolve => setTimeout(resolve, 300)); // Delay visual

    const images = await this.storageService.getImages(
      'avaliacao',
      String(this.idAvaliacao)
    );

    if (images.items.length > 0) {
      const downloadPromises = images.items.map(async (image) => {
        const res = await getDownloadURL(image);
        this.listPhotos.push({ photo: res, name: image.name });
      });

      await Promise.all(downloadPromises); // espera todas as imagens serem carregadas
    }

    await this.fecharLoading();
  }

  async novaFoto() {
    const newPicture = await this.photoService.addNewToGallery();

    await this.storageService.uploadPicture(
      'avaliacao',
      newPicture.blob,
      String(this.idAvaliacao),
      newPicture.filepath
    );

    await this.listaPhotos();
  }

  private async fecharLoading() {
    if (this.loading) {
      try {
        await this.loading.dismiss();
      } catch (e) {
        // já foi fechado ou não existe
      } finally {
        this.loading = null;
      }
    }
  }
}
