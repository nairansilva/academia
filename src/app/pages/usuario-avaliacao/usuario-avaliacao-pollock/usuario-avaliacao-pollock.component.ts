import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UsuarioAvaliacaoInterface } from '../shared/usuario-avaliacao.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlunosInterface } from '../../usuarios/shared/alunos.model';
import Chart from 'chart.js/auto';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-usuario-avaliacao-pollock',
  templateUrl: './usuario-avaliacao-pollock.component.html',
  styleUrls: ['./usuario-avaliacao-pollock.component.scss'],
})
export class UsuarioAvaliacaoPollockComponent implements OnInit, AfterViewInit {
  @Input() dadosAvaliacao: UsuarioAvaliacaoInterface;
  @Output() calculosRealizados = new EventEmitter<any>();
  @ViewChild('graficoCanvas') graficoCanvas: ElementRef;
  @ViewChild('pollockContainer') pollockContainer: ElementRef;
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

    this.calculosRealizados.emit({
      gorduraIdeal: +percentualGorduraIdeal.toFixed(2),
      gorduraAtual: +percentualGordura.toFixed(2),
      pesoGordo: +pesoGordo.toFixed(2),
      pesoMagro: +pesoMagro.toFixed(2),
      pesoDesejavel: +pesoIdeal.toFixed(2),
      pesoResidual: +pesoResidual.toFixed(2),
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
            { label: 'Peso Atual', data: [pesoAtual], backgroundColor: 'rgba(82, 183, 136, 0.7)', borderColor: '#52b788', borderWidth: 1 },
            { label: 'Peso Ideal', data: [pesoIdeal], backgroundColor: 'rgba(45, 106, 79, 0.7)', borderColor: '#2d6a4f', borderWidth: 1 },
            { label: 'Massa Gorda', data: [pesoGordo], backgroundColor: 'rgba(235, 68, 90, 0.7)', borderColor: '#eb445a', borderWidth: 1 },
            { label: 'Massa Magra', data: [pesoMagro], backgroundColor: 'rgba(64, 145, 108, 0.7)', borderColor: '#40916c', borderWidth: 1 },
          ],
        },
        options: {
          plugins: { legend: { labels: { color: '#cccccc' } } },
          scales: {
            x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
            y: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' }, beginAtZero: true }
          }
        },
      });
    }

    if (this.tipoGrafico === 'pizza') {
      this.tituloGrafico = 'Distribuição Corporal (%)';
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Gordura (%)', 'Muscular (%)', 'Outros (%)'],
          datasets: [{
            label: '%',
            data: [percentualGordura, percentualMuscular, 100 - percentualGordura - percentualMuscular],
            backgroundColor: ['rgba(235, 68, 90, 0.8)', 'rgba(82, 183, 136, 0.8)', 'rgba(136, 136, 136, 0.6)'],
            borderColor: ['#eb445a', '#52b788', '#888888'],
            borderWidth: 1,
          }],
        },
        options: {
          plugins: { legend: { labels: { color: '#cccccc' } } },
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
            { label: 'Atual (%)', data: [percentualGordura, percentualMuscular], backgroundColor: 'rgba(235, 68, 90, 0.7)', borderColor: '#eb445a', borderWidth: 1 },
            { label: 'Ideal (%)', data: [16.0, 60.0], backgroundColor: 'rgba(82, 183, 136, 0.7)', borderColor: '#52b788', borderWidth: 1 },
          ],
        },
        options: {
          indexAxis: 'y' as const,
          responsive: true,
          plugins: { legend: { labels: { color: '#cccccc' } } },
          scales: {
            x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
            y: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } }
          }
        },
      });
    }
  }

  async compartilhar() {
    const loading = await this.loadingCtrl.create({ message: 'Gerando imagem...' });
    await loading.present();

    try {
      const chartCanvas = this.graficoCanvas.nativeElement as HTMLCanvasElement;
      const PAD = 24;
      const LINE = 28;
      const fields: [string, string][] = [
        ['% Gordura Ideal', `${this.formData.get('percentualGorduraIdeal')?.value}%`],
        ['% Gordura Atual', `${this.formData.get('percentualGorduraAtual')?.value}%`],
        ['Peso Ideal', `${this.formData.get('pesoIdeal')?.value} kg`],
        ['Massa Gorda', `${this.formData.get('pesoGordo')?.value} kg`],
        ['Massa Magra', `${this.formData.get('pesoMagro')?.value} kg`],
        ['Peso Muscular', `${this.formData.get('pesoMuscular')?.value} kg`],
        ['Peso Residual', `${this.formData.get('pesoResidual')?.value} kg`],
      ];

      const W = Math.max(chartCanvas.width, 500);
      const headerH = PAD + 28 + PAD / 2 + fields.length * LINE + PAD;
      const output = document.createElement('canvas');
      output.width = W;
      output.height = headerH + chartCanvas.height + PAD;

      const ctx = output.getContext('2d')!;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, output.width, output.height);

      ctx.fillStyle = '#52b788';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillText(`Avaliação — ${this.aluno?.nome ?? ''}`, PAD, PAD + 18);

      ctx.fillStyle = '#333333';
      ctx.fillRect(PAD, PAD + 30, output.width - PAD * 2, 1);

      fields.forEach(([label, value], i) => {
        const y = PAD + 30 + PAD / 2 + 16 + i * LINE;
        ctx.fillStyle = '#888888';
        ctx.font = '13px Arial, sans-serif';
        ctx.fillText(label, PAD, y);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.fillText(value, W / 2, y);
      });

      ctx.drawImage(chartCanvas, 0, headerH);

      const fileName = `avaliacao-${Date.now()}.png`;

      if (Capacitor.isNativePlatform()) {
        const base64 = output.toDataURL('image/png').split(',')[1];
        await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
        const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
        await Share.share({ title: 'Avaliação Física', text: this.aluno?.nome ?? '', files: [uri] });
        await Filesystem.deleteFile({ path: fileName, directory: Directory.Cache });
      } else {
        await new Promise<void>((resolve) => {
          output.toBlob((blob) => {
            if (!blob) { resolve(); return; }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            resolve();
          }, 'image/png');
        });
      }
    } finally {
      await loading.dismiss();
    }
  }
}
