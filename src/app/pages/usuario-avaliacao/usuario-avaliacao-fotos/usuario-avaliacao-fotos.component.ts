import { StorageService } from 'src/app/shared/services/storage.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { PhotoService } from 'src/app/shared/services/PhotoService.service';
import { Platform } from '@ionic/angular';
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
  listPhotos: any[] = []
  constructor(
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

  cliquePhoto(photo: string) {
    this.photoSelected = photo;
    this.setOpen(true);
  }

  async listaPhotos(){
    const images = await this.storageService.getImages('avaliacao', String(this.idAvaliacao))
    if (images.items.length > 0) {
      images.items.forEach(image => {
        const url = getDownloadURL(image);
        url.then((res) => {
          this.listPhotos.push(res);
        });
      })
    }
    console.log(images)
  }

  async novaFoto() {
    const teste = await this.photoService.addNewToGallery();

    const teste2 = await this.storageService.uploadPicture(
      'avaliacao',
      teste.base64Data,
      String(this.idAvaliacao),
      teste.filepath
    );

    console.log(teste2);
  }
}
