import { UsuarioAvaliacaoComparacaoComponent } from './../usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunosInterface } from '../../usuarios/shared/alunos.model';
import { UsuarioAvaliacaoService } from '../shared/usuario-avaliacao.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';

@Component({
  selector: 'app-usuario-avaliacao',
  templateUrl: './usuario-avaliacao.component.html',
  styleUrls: ['./usuario-avaliacao.component.scss'],
})
export class UsuarioAvaliacaoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private usuarioAvaliacaoService: UsuarioAvaliacaoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {}
  usuario: AlunosInterface = {
    id: '',
    nome: '',
    nome_lower: '',
    sexo: '',
    password: '',
    email: '',
    telefone: 0,
    idade: 0,
    objetivos: '',
    perfil: 0,
  };

  modoComparacao = false;
  avaliacoesSelecionadas: any[] = [];
  loading: any;
  avaliacoesUsuario: UsuarioAvaliacaoInterface[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.usuario.id = params['id'];
      this.usuario.nome = params['nome'];
    });
  }

  ionViewWillEnter() {
    // this.ngOnInit();
    this.avaliacoesUsuario = [];
    this.avaliacoesSelecionadas = [];

    // this.router.navigate(['admin/usuarioavaliacao'], {
    //   queryParams: { usuario: this.usuario.nome, id: this.usuario.id },
    // });
    this.listaAvaliacoes();
  }

  novaAvaliacao() {
    this.router.navigate([`admin//usuarioavaliacao/${this.usuario.id}/form`]);
  }

  listaAvaliacoes() {
    this.usuarioAvaliacaoService.getByIdUsuario(this.usuario.id).subscribe({
      next: (res) => {
        console.log('avaliações', res);
        this.avaliacoesUsuario = res;
        if (this.loading) this.loading.dismiss();
      },
      error: (error) => {
        console.error(error);
        this.loading.dismiss();
      },
    });
  }

  async registroExcluido() {
    this.loading = await this.loadingCtrl.create({
      message: 'Atualizando Usuários...',
    });

    this.loading.present();
    this.avaliacoesUsuario = [];
    this.listaAvaliacoes();
  }

  cancelar() {
    this.router.navigate(['admin/usuarios']);
  }

  selecionarAvaliacao(avaliacao: any) {
    const index = this.avaliacoesSelecionadas.indexOf(avaliacao);

    if (index > -1) {
      // já está selecionado → desmarca
      this.avaliacoesSelecionadas.splice(index, 1);
    } else if (this.avaliacoesSelecionadas.length < 2) {
      // ainda cabe mais um → seleciona
      this.avaliacoesSelecionadas.push(avaliacao);
    }
  }

  async executarComparacao() {
    console.log('Comparando:', this.avaliacoesSelecionadas);

    const modal = await this.modalController.create({
      component: UsuarioAvaliacaoComparacaoComponent,
      componentProps: {
        dados: this.avaliacoesSelecionadas
      },
      breakpoints: [1],
      initialBreakpoint: 1,
      handle: false,
      cssClass: 'modal-fullscreen' // você pode personalizar isso
    });

    await modal.present();
    // aqui você pode abrir modal, navegar etc.
  }
}
