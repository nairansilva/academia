import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlunosInterface } from '../../usuarios/shared/alunos.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-usuario-avaliacao-pollock',
  templateUrl: './usuario-avaliacao-pollock.component.html',
  styleUrls: ['./usuario-avaliacao-pollock.component.scss'],
})
export class UsuarioAvaliacaoPollockComponent implements OnInit, AfterViewInit {
  @Input() dadosAvaliacao: UsuarioAvaliacaoInterface;
  @ViewChild('graficoCanvas') graficoCanvas: ElementRef;
  tipoGrafico = 'barras';
  tituloGrafico = 'Composição Corporal (kg)';
  chart: any;

  formData: FormGroup;
  aluno: AlunosInterface = JSON.parse(
    String(sessionStorage.getItem('usuarioLogado'))
  );

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const idade = this.aluno.idade;
    const sexo = this.aluno.sexo;
    const pesoAtual = this.dadosAvaliacao.pesoAtual;
    const alturaEmCm = this.dadosAvaliacao.altura * 100;

    const somaDobras =
      this.dadosAvaliacao.subscapular +
      this.dadosAvaliacao.tricipital +
      this.dadosAvaliacao.peitoral +
      this.dadosAvaliacao.axilarMedia +
      this.dadosAvaliacao.supraIliaca +
      this.dadosAvaliacao.abdominal +
      this.dadosAvaliacao.coxa;

    console.log('--- DEBUG INÍCIO (Pollock/Jackson 7 dobras) ---');
    console.log('Idade:', idade);
    console.log('Sexo:', sexo);
    console.log('Peso Atual:', pesoAtual);
    console.log('Altura (cm):', alturaEmCm);
    console.log('Soma das 7 dobras (mm):', somaDobras);

    let densidadeCorporal = 0;
    let percentualGorduraIdeal = 0;

    if (sexo === 'M') {
      densidadeCorporal =
        1.112 -
        0.00043499 * somaDobras +
        0.00000055 * Math.pow(somaDobras, 2) -
        0.00028826 * idade;
      percentualGorduraIdeal = 16.0;
    } else if (sexo === 'F') {
      densidadeCorporal =
        1.097 -
        0.00046971 * somaDobras +
        0.00000056 * Math.pow(somaDobras, 2) -
        0.00012828 * idade;
      percentualGorduraIdeal = 22.0;
    }

    const percentualGordura = (4.95 / densidadeCorporal - 4.5) * 100;
    const pesoGordo = pesoAtual * (percentualGordura / 100);
    const pesoMagro = pesoAtual - pesoGordo;
    const pesoIdeal = pesoMagro / (1 - percentualGorduraIdeal / 100);
    const pesoResidual = 19.28;
    const pesoMuscular = pesoMagro - pesoResidual;
    const percentualPesoMuscular = (pesoMuscular / pesoAtual) * 100;

    console.log('Densidade Corporal:', densidadeCorporal.toFixed(5));
    console.log('% Gordura:', percentualGordura.toFixed(2));
    console.log('Peso Gordo (kg):', pesoGordo.toFixed(2));
    console.log('Peso Magro (kg):', pesoMagro.toFixed(2));
    console.log('Peso Ideal (kg):', pesoIdeal.toFixed(2));
    console.log('Peso Residual (kg):', pesoResidual.toFixed(2));
    console.log('Peso Muscular (kg):', pesoMuscular.toFixed(2));
    console.log('% Peso Muscular:', percentualPesoMuscular.toFixed(2));
    console.log('--- DEBUG FIM ---');

    this.formData = this.fb.group({
      percentualGorduraIdeal: [
        { value: percentualGorduraIdeal.toFixed(2), disabled: true },
      ],
      percentualGorduraAtual: [
        { value: percentualGordura.toFixed(2), disabled: true },
      ],
      pesoGordo: [{ value: pesoGordo.toFixed(2), disabled: true }],
      pesoMagro: [{ value: pesoMagro.toFixed(2), disabled: true }],
      pesoIdeal: [{ value: pesoIdeal.toFixed(2), disabled: true }],
      pesoResidual: [{ value: pesoResidual.toFixed(2), disabled: true }],
      pesoMuscular: [{ value: pesoMuscular.toFixed(2), disabled: true }],
      percentualPesoMuscular: [
        { value: percentualPesoMuscular.toFixed(2), disabled: true },
      ],
    });
  }
  ngAfterViewInit() {
    this.renderizaGrafico();
  }

  renderizaGrafico() {
    if (this.chart) {
      this.chart.destroy();
    }

    const pesoAtual = this.dadosAvaliacao.pesoAtual;
    const pesoIdeal = parseFloat(this.formData.get('pesoIdeal')?.value);
    const pesoGordo = parseFloat(this.formData.get('pesoGordo')?.value);
    const pesoMagro = parseFloat(this.formData.get('pesoMagro')?.value);
    const percentualGordura = parseFloat(
      this.formData.get('percentualGorduraAtual')?.value
    );
    const percentualMuscular = parseFloat(
      this.formData.get('percentualPesoMuscular')?.value
    );

    const ctx = this.graficoCanvas.nativeElement;

    if (this.tipoGrafico === 'barras') {
      this.tituloGrafico = 'Composição Corporal (kg)';
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Avaliação'],
          datasets: [
            {
              label: 'Peso Atual',
              data: [pesoAtual],
            },
            {
              label: 'Peso Ideal',
              data: [pesoIdeal],
            },
            {
              label: 'Massa Gorda',
              data: [pesoGordo],
            },
            {
              label: 'Massa Magra',
              data: [pesoMagro],
            },
          ],
        },
      });
    }

    if (this.tipoGrafico === 'pizza') {
      this.tituloGrafico = 'Distribuição Corporal (%)';
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Gordura (%)', 'Muscular (%)', 'Outros (%)'],
          datasets: [
            {
              label: '%',
              data: [
                percentualGordura,
                percentualMuscular,
                100 - percentualGordura - percentualMuscular,
              ],
            },
          ],
        },
      });
    }

    if (this.tipoGrafico === 'comparativoPercentual') {
      this.tituloGrafico = 'Comparativo Ideal x Atual (%)';
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Gordura', 'Massa Muscular'],
          datasets: [
            {
              label: 'Atual (%)',
              data: [percentualGordura, percentualMuscular],
              backgroundColor: '#36a2eb',
            },
            {
              label: 'Ideal (%)',
              data: [16.0, 60.0],
              backgroundColor: '#4bc0c0',
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
        },
      });
    }
  }
}
