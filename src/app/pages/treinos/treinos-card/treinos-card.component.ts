import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-treinos-card',
  templateUrl: './treinos-card.component.html',
  styleUrls: ['./treinos-card.component.scss'],
})
export class TreinosCardComponent  implements OnInit {
  @Input() treino: any;
  @Output() registroExcluido = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
