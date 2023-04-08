import { UsuarioTreinoInterface } from './../shared/usuario-treinos.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/core/login/shared/login.service';
import { UsuarioTreinosService } from '../shared/usuario-treino.service';

@Component({
  selector: 'app-usuario-treinos-form',
  templateUrl: './usuario-treinos-form.component.html',
  styleUrls: ['./usuario-treinos-form.component.scss'],
})
export class UsuarioTreinosFormComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  messageToast = '';
  idUsuario: string | null;
  idTreino: string | null;
  isEdicao: boolean = false;

  loading: any;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioTreinosService: UsuarioTreinosService
  ) {
    this.idUsuario = this.route.snapshot.paramMap.get('idUsuario');
    this.idTreino = this.route.snapshot.paramMap.get('idTreino');

    this.formData = this.fb.group({
      idUsuario: [this.idUsuario],
      id: [''],
      nome: ['', [Validators.required]],
      objetivos: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.idTreino) {
      this.isEdicao = true;
      this.getTreino();
    }
  }

  async getTreino() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Treino...',
    });

    this.loading.present();

    let doc = await this.usuarioTreinosService.getById(String(this.idTreino));
    this.loading.dismiss();
    this.editeForm(doc.data(), doc.id);
  }

  editeForm(treino: UsuarioTreinoInterface, id: string): void {
    this.formData.patchValue({
      id: id,
      idUsuario: this.idUsuario,
      nome: treino.nome,
      objetivos: treino.objetivos,
    });
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...',
    });

    this.loading.present();

    if (!this.isEdicao) {
      this.postAlunoTreinos();
    } else {
      this.putAlunoTreinos();
    }
  }

  async postAlunoTreinos() {
    await this.usuarioTreinosService
      .postAlunoTreinos(this.formData.value)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'sucess';
        this.messageToast = 'Cadastro Realizado com Sucesso';
        this.formData.reset();
        this.router.navigate([`usuariotreinos/${this.idUsuario}`]);
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro ao cadastrar usuário';
        console.error(error);
      });
  }

  async putAlunoTreinos() {
    await this.usuarioTreinosService;
    let alunoSemSenha = this.formData.value;
    delete alunoSemSenha.password;
    this.usuarioTreinosService
      .putAlunoTreinos(alunoSemSenha, alunoSemSenha.id)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'success';
        this.messageToast = 'Cadastro Alterado com Sucesso';
        this.formData.reset();
        this.router.navigate(['treinos']);
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro editar usuário';
        console.error(error);
      });
  }

  setOpen(option: boolean) {
    this.isToastOpen = option;
  }

  cancelar() {
    this.formData.reset();
    this.router.navigate([`usuariotreinos/${this.idUsuario}`]);
  }
}
