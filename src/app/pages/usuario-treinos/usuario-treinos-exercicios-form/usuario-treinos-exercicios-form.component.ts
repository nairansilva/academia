import { UsuarioTreinosExerciciosService } from './../shared/usuario-treino-exercicios.service';
import { TreinosService } from './../../treinos/shared/treinos.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TreinoInterface } from '../../treinos/shared/treinos.model';
import { UsuarioTreinoInterface } from '../shared/usuario-treinos.model';
import { UsuarioTreinoExerciciosInterface } from '../shared/usuario-treinos-exercicios.model';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-usuario-treinos-exercicios-form',
  templateUrl: './usuario-treinos-exercicios-form.component.html',
  styleUrls: ['./usuario-treinos-exercicios-form.component.scss'],
})
export class UsuarioTreinosExerciciosFormComponent implements OnInit {
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.setOpen(false);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.setOpen(false);
  }

  treinos: TreinoInterface[] = [];
  formData: FormGroup;
  modalAberto = false;
  loading: any;
  idUsuario: string;
  idExercicio: string;
  id: string | null
  isEdicao = false;
  isToastOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private treinosService: TreinosService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioTreinosExerciciosService: UsuarioTreinosExerciciosService,
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform
  ) {
    this.idUsuario = String(this.route.snapshot.paramMap.get('idUsuario'));
    this.idExercicio = String(this.route.snapshot.paramMap.get('idTreino'));
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdicao = true;
    }
    this.formData = this.fb.group({
      id: [''],
      idUsuario: [this.idUsuario, [Validators.required]],
      idTreino: ['', [Validators.required]],
      nomeExercicio: [{ value: '', disabled: true }, [Validators.required]],
      equipamento: [{ value: '', disabled: true }, [Validators.required]],
      idExercicio: [this.idExercicio, [Validators.required]],
      peso: ['', [Validators.required]],
      repeticoes: ['', [Validators.required]],
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      this.setOpen(false);
    });
  }

  ngOnInit() {
    if (this.isEdicao) {
      this.getEdicao();
    }
    this.listaTreinos();
    // console.log(this.usuarioXTreino)
    // console.log(this.treino.id)
    // this.formData = this.fb.group({
    //   id: [this.treino.idExercicioAluno],
    //   idUsuario: [this.usuarioXTreino.idUsuario],
    //   idTreino: [this.treino.id],
    //   idExercicio: [this.usuarioXTreino.id],
    //   repeticoes: [this.treino.repeticoes],
    //   peso: [this.treino.peso],
    // });
  }

  setOpen(open: boolean) {
    this.modalAberto = open;
  }

  async getEdicao() {
    let doc = await this.usuarioTreinosExerciciosService.getById(String(this.id));
    this.editeForm(doc.data(), doc.id);
  }

  editeForm(exercicio: UsuarioTreinoExerciciosInterface, id: string) {
    this.formData.patchValue({
      id: id,
      idUsuario: exercicio.idUsuario,
      idTreino: exercicio.idTreino,
      nomeExercicio: exercicio.nomeExercicio,
      equipamento: exercicio.equipamento,
      idExercicio: exercicio.idExercicio,
      peso: exercicio.peso,
      repeticoes: exercicio.repeticoes,
    });
  }

  async listaTreinos() {
    this.loading = await this.loadingCtrl.create({
      message: 'Preparando Dados...',
    });

    this.loading.present();
    this.treinosService.getTreinos().subscribe({
      next: (res) => {
        console.log(res);
        this.treinos = res;
        this.loading.dismiss();
      },
    });
  }

  adicionaTreino(treino: TreinoInterface) {
    this.formData.patchValue({
      idTreino: treino.id,
      nomeExercicio: treino.nome,
      equipamento: treino.equipamento,
    });
    this.setOpen(false);
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...',
    });

    this.loading.present();

    if (!this.isEdicao) {
      await this.incluiAlunoExercicio();
    } else {
      await this.editaAlunoExercicio();
    }
  }

  async incluiAlunoExercicio() {
    await this.usuarioTreinosExerciciosService
      .postAlunoTreinosExercicios(this.formData.getRawValue())
      .then(async (res) => {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Registro Salvo com Sucesso!',
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        await toast.present();

        this.formData.reset();
        this.router.navigate([
          `admin/usuariotreinos/${this.idUsuario}/form/${this.idExercicio}/exercicios`,
        ]);
      })
      .catch(async (error) => {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Erro na inclusão!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        await toast.present();
        console.error(error);
      });
  }

  async editaAlunoExercicio() {
    await this.usuarioTreinosExerciciosService
      .putAlunoTreinosExercicios(this.formData.getRawValue(), String(this.id))
      .then(async (res) => {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Registro Salvo com Sucesso!',
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        await toast.present();

        this.formData.reset();
        this.router.navigate([
          `admin/usuariotreinos/${this.idUsuario}/form/${this.idExercicio}/exercicios`,
        ]);
      })
      .catch(async (error) => {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Erro na inclusão!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        await toast.present();
        console.error(error);
      });
  }

  cancelar() {
    this.router.navigate([
      `admin/usuariotreinos/${this.idUsuario}/form/${this.idExercicio}/exercicios`,
    ]);
  }
}
