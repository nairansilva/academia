import { Router } from '@angular/router';
import { StorageService } from './../../../shared/services/storage.service';
import { UsuariosService } from './../shared/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { AlunosInterface } from '../shared/alunos.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  constructor(
    private usuariosService: UsuariosService,
    private storageService: StorageService,
    private router:Router,
    private loadingCtrl: LoadingController
  ) {}

  imagem = '';
  usuarios: AlunosInterface[] =[];

  ngOnInit() {
    this.usuariosService.getAlunos().subscribe({
      next: (res) => {this.usuarios = res},
      error: (error) => console.error(error),
    });
  }

  novoUsuario(){
    console.log('oi')
    this.router.navigate(['/usuarios/form'])
  }

  async buscaAlunos(busca:Event){
    const loading = await this.loadingCtrl.create({
      message: 'Buscando Usuários...',
      duration: 3000,
    });

    loading.present();
  }
}
