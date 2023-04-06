import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { LoginSuccessInterface } from '../shared/loginSuccess.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {

  }

  login() {
    this.loginService
      .login(this.formData.value)
      .then((res) => {
        console.log('entrei', res);
        localStorage.setItem('user', res.user);
        this.router.navigate(['usuarios']);
      })
      .catch((error) => {
        (this.isToastOpen = true), console.error(error);
      });
    // this.loginService.login(this.formData.value).subscribe({
    //   next: (res: LoginSuccessInterface) => {
    //     console.log('loguei', res);
    //     this.router.navigate(['usuarios'])
    //   },
    //   error: (error: any) => {
    //     console.error(error);
    //   },
    // });
  }

  setOpen(showHelp = false) {
    this.isToastOpen = showHelp;
  }
}
