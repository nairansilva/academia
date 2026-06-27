import { AlunosInterface } from './../shared/alunos.model';
import { UsuariosService } from './../shared/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
  id: string | null;
  isEdicao: boolean = false;
  tituloPagina = 'Novo Aluno';

  loading: any;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService
  ) {
    this.formData = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      sexo: ['F'],
      telefone: [''],
      idade: [''],
      objetivos: [''],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.isEdicao = true;
      this.tituloPagina = 'Edição de Aluno';
      this.getUsuario();
    }

    this.validInputs();
  }

  validInputs() {
    this.formData.controls['telefone'].valueChanges.subscribe({
      next: (res: any) => {
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

  async getUsuario() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Aluno...',
    });

    this.loading.present();

    let doc = await this.usuariosService.getById(String(this.id));
    this.loading.dismiss();
    this.editeForm(doc.data(), doc.id);
  }

  editeForm(usuario: AlunosInterface, id: string): void {
    this.formData.patchValue({
      id: id,
      nome: usuario.nome,
      sexo: usuario.sexo,
      telefone: usuario.telefone,
      idade: usuario.idade,
      objetivos: usuario.objetivos,
    });
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...',
    });

    this.loading.present();

    if (!this.isEdicao) {
      this.postAlunos();
    } else {
      this.putAlunos();
    }
  }

  setOpen(option: boolean) {
    this.isToastOpen = option;
  }

  async postAlunos() {
    await this.usuariosService
      .postAluno(this.formData.value)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'sucess';
        this.messageToast = 'Cadastro Realizado com Sucesso';
        this.formData.reset();
        this.router.navigate(['admin/usuarios']);
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro ao cadastrar aluno';
        console.error(error);
      });
  }

  async putAlunos() {
    let aluno = this.formData.value;
    this.usuariosService
      .putAluno(aluno, aluno.id)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'success';
        this.messageToast = 'Cadastro Alterado com Sucesso';
        this.formData.reset();
        this.router.navigate(['admin/usuarios']);
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro ao editar aluno';
        console.error(error);
      });
  }

  cancelar() {
    this.formData.reset();
    this.router.navigate(['admin/usuarios']);
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
