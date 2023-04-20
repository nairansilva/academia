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
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  formData: FormGroup;
  aluno: AlunosInterface = JSON.parse(
    String(sessionStorage.getItem('usuarioLogado'))
  );
  barChart: any;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

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
        percentualGorduraIdeal: [{ value: 20, disabled: true }],
        percentualGorduraAtual: [
          { value: percentualDeGorduraMasculino.toFixed(2), disabled: true },
        ],
        pesoGordo: [
          {
            value: (84 * (percentualDeGorduraMasculino / 100)).toFixed(2),
            disabled: true,
          },
        ],
        pesoMagro: [
          {
            value: (
              this.dadosAvaliacao.pesoAtual -
              84 * (percentualDeGorduraMasculino / 100)
            ).toFixed(2),
            disabled: true,
          },
        ],
        pesoDesejavel: [
          {
            value: (
              50 +
              0.91 * (this.dadosAvaliacao.altura * 100 - 152.4)
            ).toFixed(2),
            disabled: true,
          },
        ],
        pesoResidual: [
          {
            value: (this.dadosAvaliacao.pesoAtual * 0.15).toFixed(2),
            disabled: true,
          },
        ],
      });
    } else {
      this.formData = this.fb.group({
        percentualGorduraIdeal: [{ value: 28, disabled: true }],
        percentualGorduraAtual: [
          { value: percentualDeGorduraFeminino.toFixed(2), disabled: true },
        ],
        pesoGordo: [
          {
            value: (84 * (percentualDeGorduraFeminino / 100)).toFixed(2),
            disabled: true,
          },
        ],
        pesoMagro: [
          {
            value: (
              this.dadosAvaliacao.pesoAtual -
              84 * (percentualDeGorduraFeminino / 100)
            ).toFixed(2),
            disabled: true,
          },
        ],
        pesoDesejavel: [
          {
            value: (
              45.5 +
              0.91 * (this.dadosAvaliacao.altura * 100 - 152.4)
            ).toFixed(2),
            disabled: true,
          },
        ],
        pesoResidual: [
          {
            value: (this.dadosAvaliacao.pesoAtual * 0.15).toFixed(2),
            disabled: true,
          },
        ],
      });
    }
  }

  ngAfterViewInit() {
    this.barChartMethod();
  }

  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Avaliação'],
        datasets: [
          {
            label: 'Peso Atual',
            data: [this.dadosAvaliacao.pesoAtual],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255,99,132,1)'],
            borderWidth: 1,
          },
          {
            label: 'Peso Ideal',
            data: [this.formData.get('pesoDesejavel')?.value],
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
          {
            label: 'Peso Gordo',
            data: [this.formData.get('pesoGordo')?.value],
            backgroundColor: ['rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          },
          {
            label: 'Peso Magro',
            data: [this.formData.get('pesoMagro')?.value],
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          // yAxes: [
          //   {
          //     type:'linear',
          //     beginAtZero: true,
          //   },
          // ],
        },
      },
    });
  }
}
