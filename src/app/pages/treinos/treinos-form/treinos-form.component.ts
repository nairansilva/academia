import { TreinosService } from './../shared/treinos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/core/login/shared/login.service';
import { TreinoInterface } from '../shared/treinos.model';

@Component({
  selector: 'app-treinos-form',
  templateUrl: './treinos-form.component.html',
  styleUrls: ['./treinos-form.component.scss'],
})
export class TreinosFormComponent  implements OnInit {

  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  messageToast = '';
  id: string | null;
  isEdicao: boolean = false;

  loading: any;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private treinosService: TreinosService,
    private loginService: LoginService
  ) {
    this.formData = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      equipamento: ['', [Validators.required]],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.isEdicao = true;
      this.getTreino();
    }
  }

  async getTreino() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Treino...',
    });

    this.loading.present();

    let doc = await this.treinosService.getById(String(this.id));
    this.loading.dismiss();
    this.editeForm(doc.data(), doc.id);
  }

  editeForm(treino: TreinoInterface, id:string): void {
    this.formData.patchValue({
      id: id,
      nome: treino.nome,
      equipamento: treino.equipamento
    });
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...',
    });

    this.loading.present();

    if (!this.isEdicao) {
      await this.treinosService
        .postTreino(this.formData.value)
        .then((res) => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.colorHelp = 'sucess';
          this.messageToast = 'Cadastro Realizado com Sucesso';
          this.formData.reset();
          this.router.navigate(['treinos']);
        })
        .catch((error) => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.colorHelp = 'danger';
          this.messageToast = 'Erro ao cadastrar usuário';
          console.error(error);
        });
    } else {
      await this.treinosService
        let alunoSemSenha = this.formData.value
        delete alunoSemSenha.password;
        this.treinosService.putTreino(alunoSemSenha, alunoSemSenha.id)
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
  }

  setOpen(option: boolean) {
    this.isToastOpen = option;
  }

  cancelar() {
    this.formData.reset();
    this.router.navigate(['treinos']);
  }

}
