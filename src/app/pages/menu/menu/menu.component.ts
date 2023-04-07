import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/login/shared/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  handlerMessage = '';
  roleMessage = '';

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
        this.loginService.logout();
        this.router.navigate(['/login']);
      },
    },
  ];

  setResult(ev: any) {
  }

  constructor(private router: Router, private loginService: LoginService, private alertController:AlertController) {}

  ngOnInit() {
    this.router.navigate(['usuarios'])
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Confirma o Logout?',
      buttons: this.alertButtons
    });

    await alert.present();
  }

}
