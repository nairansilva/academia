import { UsuariosService } from './../shared/usuarios.service';
import { PhotoService } from './../../../shared/services/PhotoService.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss'],
})
export class UsuariosFormComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  messageToast = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.formData = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      telefone: [''],
      idade: [''],
      objetivos: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formData.controls['telefone'].valueChanges.subscribe({
      next: (res) => {
        this.formData.patchValue(
          {
            telefone: this.transformPhone(res),
          },
          { emitEvent: false }
        );
      },
    });

    this.formData.controls['idade'].valueChanges.subscribe({
      next: (res) => {
        this.formData.patchValue(
          {
            idade: res ? res.toString().replace(/\D/g, '') : '',
          },
          { emitEvent: false }
        );
      },
    });
  }

  salvar() {
    this.usuariosService
      .postAlunos(this.formData.value)
      .then((res) => {
        this.isToastOpen = true;
        this.colorHelp = 'sucess';
        this.messageToast = 'Cadastro Realizado com Sucesso';
        this.formData.reset();
        this.router.navigate(['usuarios']);
      })
      .catch((error) => {
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro ao cadastrar usuário';
        console.error(error);
      });
  }

  setOpen(option: boolean) {
    this.isToastOpen = option;
  }

  cancelar() {
    this.formData.reset();
    this.router.navigate(['usuarios']);
  }

  transformPhone(tel: string) {
    let foneFormatado = '';
    if (tel) {
      // Remove dígitos não numéricos
      const value = tel.toString().replace(/\D/g, '');

      // PP -> código do país, AA -> código da área
      if (value.length > 12) {
        // PPAA######## -> +PP (AA) #####-####
        foneFormatado = value.replace(
          /(\d{2})?(\d{2})?(\d{5})?(\d{4})/,
          '+$1 ($2) $3-$4'
        );
      } else if (value.length > 11) {
        // PPAA######## -> +PP (AA) ####-####
        foneFormatado = value.replace(
          /(\d{2})?(\d{2})?(\d{4})?(\d{4})/,
          '+$1 ($2) $3-$4'
        );
      } else if (value.length > 10) {
        // AA######### -> (AA) #####-####
        foneFormatado = value.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');
      } else if (value.length > 9) {
        // AA######### -> (AA) ####-####
        foneFormatado = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');
      } else if (value.length > 5) {
        // ####### -> (AA) ####-#
        foneFormatado = value.replace(
          /^(\d{2})?(\d{4})?(\d{0,4})/,
          '($1) $2-$3'
        );
      } else if (value.length > 1) {
        // #### -> (AA) ##
        foneFormatado = value.replace(/^(\d{2})?(\d{0,5})/, '($1) $2');
      } else {
        if (tel !== '') {
          foneFormatado = value.replace(/^(\d*)/, '($1');
        }
      }
    }
    return foneFormatado;
  }
}
