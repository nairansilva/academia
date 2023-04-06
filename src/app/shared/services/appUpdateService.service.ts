import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate, private alertController: AlertController) {
    this.updates.versionUpdates.subscribe((event) => {
      this.presentAlert();
    });
  }
  // showAppUpdateAlert() {
  //   const header = 'App Update available';
  //   const message = 'Choose Ok to update';
  //   const action = this.doAppUpdate;
  //   const caller = this;
  //   // Use MatDialog or ionicframework's AlertController or similar
  //   presentAlert(header, message, action, caller);
  // }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Nova Versão Disponível',
      message: 'O APP será atualizado!',
      buttons: ['OK'],
    });

    await alert.present();

    this.doAppUpdate()
  }

  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
