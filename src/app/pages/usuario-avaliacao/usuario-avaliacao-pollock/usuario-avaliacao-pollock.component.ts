import { Component, Input, OnInit } from '@angular/core';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlunosInterface } from '../../usuarios/shared/alunos.model';

@Component({
  selector: 'app-usuario-avaliacao-pollock',
  templateUrl: './usuario-avaliacao-pollock.component.html',
  styleUrls: ['./usuario-avaliacao-pollock.component.scss'],
})
export class UsuarioAvaliacaoPollockComponent implements OnInit {
  @Input() dadosAvaliacao: UsuarioAvaliacaoInterface;
  formData: FormGroup;
  aluno: AlunosInterface = JSON.parse(
    String(sessionStorage.getItem('usuarioLogado'))
  );

  constructor(private fb: FormBuilder, private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    const totalComposicao =
    this.dadosAvaliacao.subscapular +
    this.dadosAvaliacao.tricipital +
    this.dadosAvaliacao.peitoral +
    this.dadosAvaliacao.axilarMedia +
    this.dadosAvaliacao.supraIliaca +
    this.dadosAvaliacao.abdominal +
    this.dadosAvaliacao.coxa;

  const percentualDeGorduraMasculino =
    0.29288 * totalComposicao -
    0.0005 * (totalComposicao * totalComposicao) +
    0.15845 * this.aluno.idade -
    5.76377;

    const percentualDeGorduraFeminino =
    0.29669 * totalComposicao -
    0.00043 * (totalComposicao * totalComposicao) +
    0.02963 * this.aluno.idade -
    1.4072;

  if (this.aluno.sexo === 'M') {
    this.formData = this.fb.group({
      percentualGorduraIdeal: [20],
      percentualGorduraAtual: [percentualDeGorduraMasculino.toFixed(2)],
      pesoGordo: [(84*(percentualDeGorduraMasculino/100)).toFixed(2)],
      pesoMagro: [(this.dadosAvaliacao.pesoAtual - (84*(percentualDeGorduraMasculino/100))).toFixed(2)],
      pesoDesejavel: [(50+0.91*((this.dadosAvaliacao.altura*100)-152.4)).toFixed(2)],
      pesoResidual: [(this.dadosAvaliacao.pesoAtual * 0.15).toFixed(2)],
    });
  } else {
    this.formData = this.fb.group({
      percentualGorduraIdeal: [28],
      percentualGorduraAtual: [percentualDeGorduraFeminino.toFixed(2)],
      pesoGordo: [(84*(percentualDeGorduraFeminino/100)).toFixed(2)],
      pesoMagro: [(this.dadosAvaliacao.pesoAtual - (84*(percentualDeGorduraFeminino/100))).toFixed(2)],
      pesoDesejavel: [(45.5 + 0.91 * (( this.dadosAvaliacao.altura *100)- 152.4)).toFixed(2)],
      pesoResidual: [(this.dadosAvaliacao.pesoAtual * 0.15).toFixed(2)],
    });
  }

  }
}
