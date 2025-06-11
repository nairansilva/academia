import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UsuarioTreinosService } from '../../usuario-treinos/shared/usuario-treino.service';
import { UsuarioAvaliacaoService } from '../shared/usuario-avaliacao.service';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-usuario-avaliacao-form',
  templateUrl: './usuario-avaliacao-form.component.html',
  styleUrls: ['./usuario-avaliacao-form.component.scss'],
})
export class UsuarioAvaliacaoFormComponent implements OnInit {
  formData: FormGroup;
  colorHelp = 'danger';
  isToastOpen: boolean = false;
  messageToast = '';
  idUsuario: string | null;
  idAvaliacao: string | null;
  tituloDaPagina = 'Nova Avaliação';
  isEdicao = false;
  loading: HTMLIonLoadingElement;
  segmento: string = 'composicao';

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private decimalPipe: DecimalPipe,
    private usuarioAvaliacaoService: UsuarioAvaliacaoService
  ) {
    this.idUsuario = this.route.snapshot.paramMap.get('idUsuario');
    this.idAvaliacao = this.route.snapshot.paramMap.get('id');

    this.formData = this.fb.group({
      idUsuario: [this.idUsuario],
      id: [''],
      dataAvaliacao: [''],
      pesoAtual: [],
      altura: [],
      subscapular: [],
      tricipital: [],
      peitoral: [],
      axilarMedia: [],
      supraIliaca: [],
      abdominal: [],
      coxa: [],
      torax: [],
      cintura: [],
      abdome: [],
      quadril: [],
      antebracos: [],
      bracos: [],
      coxas: [],
      panturrilhas: [],
      gorduraIdeal: [],
      gorduraAtual: [],
      pesoGordo: [],
      pesoMagro: [],
      pesoDesejavel: [],
      pesoResidual: [],
      totalFlexoes:[],
      totalAbdominais:[]
    });

    // this.formData.valueChanges.subscribe((val) => {
    //   console.log(val)
    //   // if (typeof val.amount === 'string') {
    //   //   const maskedVal = this.formatarDecimal(val.amount);
    //   //   if (val.amount !== maskedVal) {
    //   //     this.formData.patchValue({amount: maskedVal});
    //   //   }
    //   // }
    // });

  }

  ngOnInit(): void {
    if (this.idAvaliacao) {
      this.isEdicao = true;
      this.tituloDaPagina = 'Edição do Treino';
      this.getAvaliacao();
    }
  }

  async getAvaliacao() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Treino...',
    });

    this.loading.present();

    let doc = await this.usuarioAvaliacaoService.getById(
      String(this.idAvaliacao)
    );
    this.loading.dismiss();
    this.editeForm(doc.data(), doc.id);
  }

  editeForm(avaliacao: UsuarioAvaliacaoInterface, id: string): void {
    this.formData.patchValue({
      idUsuario: this.idUsuario,
      id: this.idAvaliacao,
      dataAvaliacao: avaliacao.dataAvaliacao,
      pesoAtual: avaliacao.pesoAtual,
      altura: avaliacao.altura,
      subscapular: avaliacao.subscapular,
      tricipital: avaliacao.tricipital,
      peitoral: avaliacao.peitoral,
      axilarMedia: avaliacao.axilarMedia,
      supraIliaca: avaliacao.supraIliaca,
      abdominal: avaliacao.abdominal,
      coxa: avaliacao.coxa,
      torax: avaliacao.torax,
      cintura: avaliacao.cintura,
      abdome: avaliacao.abdome,
      quadril: avaliacao.quadril,
      antebracos: avaliacao.antebracos,
      bracos: avaliacao.bracos,
      coxas: avaliacao.coxas,
      panturrilhas: avaliacao.panturrilhas,
      gorduraIdeal: avaliacao.gorduraIdeal,
      gorduraAtual: avaliacao.gorduraAtual,
      pesoGordo: avaliacao.pesoGordo,
      pesoMagro: avaliacao.pesoMagro,
      pesoDesejavel: avaliacao.pesoDesejavel,
      pesoResidual: avaliacao.pesoResidual,
      totalFlexoes: avaliacao.totalFlexoes,
      totalAbdominais: avaliacao.totalAbdominais
    });
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...',
    });

    this.loading.present();

    if (!this.isEdicao) {
      this.postUsuarioAvaliacao();
    } else {
      this.putUsuarioAvaliacao();
    }
  }

  async postUsuarioAvaliacao() {
    await this.usuarioAvaliacaoService
      .postUsuarioAvaliacao(this.formData.value)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'sucess';
        this.messageToast = 'Cadastro Realizado com Sucesso';
        this.formData.reset();
        this.router.navigate(['admin/usuarioavaliacao'], {
          queryParams: { usuario: '', id: this.idUsuario },
        });
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro ao cadastrar usuário';
        console.error(error);
      });
  }

  async putUsuarioAvaliacao() {
    await this.usuarioAvaliacaoService;
    let alunoSemSenha = this.formData.value;
    delete alunoSemSenha.password;
    this.usuarioAvaliacaoService
      .putUsuarioAvaliacoa(alunoSemSenha, alunoSemSenha.id)
      .then((res) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'success';
        this.messageToast = 'Cadastro Alterado com Sucesso';
        this.formData.reset();
        this.router.navigate(['admin/usuarioavaliacao'], {
          queryParams: { usuario: '', id: this.idUsuario },
        });
      })
      .catch((error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.colorHelp = 'danger';
        this.messageToast = 'Erro editar avaliação';
        console.error(error);
      });
  }

  trocaSegmento(ev: any) {
    console.log(ev);
    this.segmento = ev.detail.value;
  }

  setOpen(option: boolean) {
    this.isToastOpen = option;
  }

  cancelar() {
    this.formData.reset();
    this.router.navigate(['admin/usuarioavaliacao'], {
      queryParams: { usuario: '', id: this.idUsuario },
    });
  }

  formatarDecimal(valor: any) {
    console.log(this.decimalPipe.transform((String(valor), '1.2-2')))
    // console.log(valor)
    // let amount = String(valor);

    // const beforePoint = amount.split('.')[0];
    // let integers = '';
    // if (typeof beforePoint !== 'undefined') {
    //   integers = beforePoint.replace(/\D+/g, '');
    // }
    // const afterPoint = amount.split('.')[1];
    // let decimals = '';
    // if (typeof afterPoint !== 'undefined') {
    //   decimals = afterPoint.replace(/\D+/g, '');
    // }
    // if (decimals.length > 2) {
    //   decimals = decimals.slice(0, 2);
    // }
    // amount = integers;
    // if (typeof afterPoint === 'string') {
    //   amount += '.';
    // }
    // if (decimals.length > 0) {
    //   amount += decimals;
    // }

    // return amount;
  }
}
