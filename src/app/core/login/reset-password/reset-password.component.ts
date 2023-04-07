import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  loading: any;
  desabilitaLogin = false;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loginService: LoginService,
    private router: Router
  ) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async resetSenha() {
    const teste = await this.loginService.fotgotPassword();
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'E-mail enviado com Sucesso.',
      buttons: ['Ok'],
    });

    await alert.present();

    this.router.navigate(['login']);
  }

  ngOnInit(): void {}
}
