import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonTabs, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/core/login/shared/login.service';

@Component({
  selector: 'app-menu-alunos',
  templateUrl: './menu-alunos.component.html',
  styleUrls: ['./menu-alunos.component.scss'],
})
export class MenuAlunosComponent  implements OnInit {

  @ViewChild('tabs', {static: true}) tabs:IonTabs


  handlerMessage = '';
  roleMessage = '';
  isAdmin = true;
  isLoading = true;
  loading:any;

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

  constructor(
    private router: Router,
    private loginService: LoginService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  goTo(page: string) {
    this.router.navigate([page]);
  }

  setResult(ev: any) {}

  async ionViewDidEnter(){
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Dados...',
    });

    await this.loading.present();

    this.isAdmin = this.loginService.isUserAdmin;

    this.isAdmin = this.loginService.isUserAdmin;
    this.isLoading = false;
    this.loading.dismiss();
    this.tabs.select('treinamentos')
  }

  async ngOnInit() {
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Confirma o Logout?',
      buttons: this.alertButtons,
    });

    await alert.present();
  }
}
