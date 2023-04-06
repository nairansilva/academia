import { UsuariosService } from './../shared/usuarios.service';
import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-usuarios-card',
  templateUrl: './usuarios-card.component.html',
  styleUrls: ['./usuarios-card.component.scss'],
})
export class UsuariosCardComponent  implements OnInit {
  @Input() usuario:any;
  constructor(private usuariosService:UsuariosService) { }

  imagem = './../../../../assets/imgs/avatar-do-usuario.png'

  ngOnInit() {
    console.log(this.usuario)
    this.usuariosService
      .getPictures(this.usuario.id)
      .then((res) => {
        console.log('imagem', res);
        const imgProfile = res.items.filter((item:any) =>
          item.name.includes(this.usuario.id)
        );
        if (imgProfile.length > 0) {
          const url = getDownloadURL(imgProfile[0]);
          url.then((res) => {
            console.log(res);
            this.imagem = res
          });
        }
      })
      .catch((error) => console.error(error));
  }

  openPhone(){
    window.open('tel:'+this.usuario.telefone);
  }
  teste(){
    console.log('a')
  }

}
