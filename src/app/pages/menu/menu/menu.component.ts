import { AlertController, LoadingController, IonTabBar, IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/core/login/shared/login.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
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
    console.log(this.tabs)
    // if (this.isAdmin){
    //   this.router.navigate(['usuarios']);
    // } else {
    //   this.router.navigate(['treinamentos']);
    // }
    this.tabs.select('usuarios')
  }

  async ngOnInit() {
    console.log(this.tabs)

    // this.router.navigate(['admin/usuarios']);
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
