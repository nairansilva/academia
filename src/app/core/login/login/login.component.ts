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

  constructor(private fb: FormBuilder, private loginService: LoginService, private router:Router) {
    this.formData = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    setInterval(()=> {console.log('teste')},5000)

  }

  login() {
    this.loginService.login(this.formData.value).subscribe({
      next: (res: LoginSuccessInterface) => {
        console.log('loguei', res);
        this.router.navigate(['usuarios'])
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
