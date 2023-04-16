import { LoginService } from 'src/app/core/login/shared/login.service';
import { UsuarioTreinosService } from './../shared/usuario-treino.service';
import { UsuarioTreinoInterface } from './../shared/usuario-treinos.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuario-treinos',
  templateUrl: './usuario-treinos.component.html',
  styleUrls: ['./usuario-treinos.component.scss'],
})
export class UsuarioTreinosComponent implements OnInit {
  usuarioXTreinos: UsuarioTreinoInterface[] = [];
  idUsuario: string | null;
  isAdmin = false;

  constructor(
    private router: Router,
    private usuarioTreinosService: UsuarioTreinosService,
    private loginService:LoginService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {
    this.idUsuario = this.route.snapshot.paramMap.get('idUsuario');
    this.isAdmin = this.loginService.isUserAdmin;
  }

  filtro = '';
  pagina = 1;
  loading: any;

  ngOnInit() {
    this.listaTreinos();
  }

  listaTreinos() {
    const lastName = this.usuarioXTreinos[this.usuarioXTreinos.length - 1]
      ? this.usuarioXTreinos[this.usuarioXTreinos.length - 1].nome
      : '';
    this.usuarioTreinosService
      .getAlunoTreinos(String(this.idUsuario), this.pagina)
      .subscribe({
        next: (res) => {
          this.usuarioXTreinos = this.usuarioXTreinos = res;
          if (this.loading) this.loading.dismiss();
        },
        error: (error) => {
          console.error(error);
          this.loading.dismiss();
        },
      });
  }

  novoTreino() {
    this.router.navigate([`admin/usuariotreinos/${this.idUsuario}/form`]);
  }

  voltar(){
    this.router.navigate([`admin/usuarios/form/${this.idUsuario}` ])
  }

  async registroExcluido() {
    this.loading = await this.loadingCtrl.create({
      message: 'Atualizando Treinos...',
    });

    this.loading.present();
    this.usuarioXTreinos = [];
    this.listaTreinos();
  }

  onIonInfinite(ev: any) {
    this.pagina++;
    this.listaTreinos();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
