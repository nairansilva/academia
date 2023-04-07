import { TreinoInterface } from './../shared/treinos.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.scss'],
})
export class TreinosComponent implements OnInit {
  treinos: TreinoInterface[] = [];
  constructor() {}

  ngOnInit() {}

  buscaTreinos(ev: any) {}

  novoTreino() {}

  onIonInfinite(ev: any) {}

  registroExcluido(){}
}
