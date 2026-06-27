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
    this.desabilitaLogin = true;
    await this.loginService.fotgotPassword(this.formData.value.email);

    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'E-mail enviado com sucesso.',
      buttons: ['Ok'],
    });
    await alert.present();
    this.router.navigate(['login']);
  }

  voltar() {
    this.router.navigate(['login']);
  }

  ngOnInit(): void {}
}
