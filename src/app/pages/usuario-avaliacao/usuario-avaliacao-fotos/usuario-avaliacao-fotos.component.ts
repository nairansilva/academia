import { StorageService } from 'src/app/shared/services/storage.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { PhotoService } from 'src/app/shared/services/PhotoService.service';
import { LoadingController, Platform } from '@ionic/angular';
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
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.setOpen(false);
    });
  }

  ngOnInit() {
    this.listaPhotos();
  }

  setOpen(open: boolean) {
    this.modalAberto = open;
  }

  async cliquePhoto(photo: any) {
    this.loading = await this.loadingCtrl.create({
      message: 'excluindo Fotos...',
    });
    this.photoSelected = photo;
    await this.storageService.deletePicture(
      'avaliacao',
      String(this.idAvaliacao),
      photo.name
    );

    this.listaPhotos();
  }

  async listaPhotos() {
    this.listPhotos = [];
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Fotos...',
    });
    let nContator = 0;
    const images = await this.storageService.getImages(
      'avaliacao',
      String(this.idAvaliacao)
    );
    if (images.items.length > 0) {
      images.items.forEach((image, index) => {
        const url = getDownloadURL(image);
        url.then((res) => {
          this.listPhotos.push({ photo: res, name: image.name });
          nContator++;
          if ((nContator = images.items.length)) {
            this.loading.dismiss();
          }
        });
      });
    }
  }

  async novaFoto() {
    const newPicture = await this.photoService.addNewToGallery();

    await this.storageService.uploadPicture(
      'avaliacao',
      newPicture.base64Data,
      String(this.idAvaliacao),
      newPicture.filepath
    );
    this.listaPhotos();
  }
}
