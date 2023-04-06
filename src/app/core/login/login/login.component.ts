import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { LoginSuccessInterface } from '../shared/loginSuccess.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  loading:any;
  desabilitaLogin = false;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private loginService: LoginService,
    private router: Router
  ) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {}

  async login() {
    this.desabilitaLogin = true;
    this.loading = await this.loadingCtrl.create({
      message: 'Realizando Login...',
    });

    this.loading.present();

    this.loginService
      .login(this.formData.value)
      .then((res) => {
        this.desabilitaLogin = false;
        console.log('entrei', res);
        localStorage.setItem('user', res.user);
        this.loading.dismiss();
        this.router.navigate(['usuarios']);
      })
      .catch((error) => {
        (this.isToastOpen = true);
        this.loading.dismiss();
        this.desabilitaLogin = false;
        console.error(error);
      });
  }

  async buscaAlunos(busca: Event) {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando Usuários...',
    });

    loading.present();
  }

  setOpen(showHelp = false) {
    this.isToastOpen = showHelp;
  }
}
