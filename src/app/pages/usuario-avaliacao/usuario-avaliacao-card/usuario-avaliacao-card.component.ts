import { Component, Input, OnInit } from '@angular/core';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';

@Component({
  selector: 'app-usuario-avaliacao-card',
  templateUrl: './usuario-avaliacao-card.component.html',
  styleUrls: ['./usuario-avaliacao-card.component.scss'],
})
export class UsuarioAvaliacaoCardComponent implements OnInit {
  @Input() usuarioNome: string;
  @Input() avalicao: UsuarioAvaliacaoInterface;
  constructor() {}

  ngOnInit() {}

  editar() {}

  excluir() {}
}
