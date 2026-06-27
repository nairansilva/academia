import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-usuario-avaliacao-comparacao',
  templateUrl: './usuario-avaliacao-comparacao.component.html',
  styleUrls: ['./usuario-avaliacao-comparacao.component.scss'],
})
export class UsuarioAvaliacaoComparacaoComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private loadingCtrl: LoadingController) {}

  @Input() dados: any[] = [];
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoForcaCanvas') graficoForcaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoPeriMetrosCanvas') graficoPeriMetrosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comparacaoContainer') comparacaoContainer: ElementRef<HTMLDivElement>;

  labels: string[] = [];
  tipoComparacao: 'barras' | 'radar' = 'barras';

  private a1: any;
  private a2: any;
  private labelsDatas: string[] = [];
  private d1: any;
  private d2: any;
  private aluno: any;

  private chartComposicao: Chart | undefined;
  private chartForca: Chart | undefined;
  private chartPerimetros: Chart | undefined;

  ngOnInit() {
    this.labels = this.dados.map((a) =>
      new Date(a.dataAvaliacao).toLocaleDateString()
    );
  }

  ngAfterViewInit() {
    if (this.dados.length !== 2) return;

    [this.a1, this.a2] = this.dados;
    this.labelsDatas = [
      new Date(this.a1.dataAvaliacao).toLocaleDateString(),
      new Date(this.a2.dataAvaliacao).toLocaleDateString(),
    ];

    this.aluno = JSON.parse(String(sessionStorage.getItem('usuarioLogado')));

    const mapDados = (a: any) => {
      const pesoAtual = a.pesoAtual ?? 0;
      const somaDobras = [
        a.subscapular, a.tricipital, a.peitoral,
        a.axilarMedia, a.supraIliaca, a.abdominal, a.coxa,
      ].reduce((soma, val) => soma + (val ?? 0), 0);

      const idade = this.aluno?.idade ?? 30;
      const sexo = this.aluno?.sexo ?? 'M';

      let densidade = 1;
      if (sexo === 'M') {
        densidade = 1.112 - 0.00043499 * somaDobras + 0.00000055 * Math.pow(somaDobras, 2) - 0.00028826 * idade;
      } else {
        densidade = 1.097 - 0.00046971 * somaDobras + 0.00000056 * Math.pow(somaDobras, 2) - 0.00012828 * idade;
      }

      const percGordura = (4.95 / densidade - 4.5) * 100;
      const pesoGordo = pesoAtual * (percGordura / 100);
      const pesoMagro = pesoAtual - pesoGordo;

      return {
        pesoAtual,
        pesoMagro: +pesoMagro.toFixed(1),
        pesoGordo: +pesoGordo.toFixed(1),
        '% Gordura': +percGordura.toFixed(1),
      };
    };

    this.d1 = mapDados(this.a1);
    this.d2 = mapDados(this.a2);

    this.renderizarGraficos();
  }

  trocarTipo(ev: any) {
    this.tipoComparacao = ev.detail.value;
    this.renderizarGraficos();
  }

  private renderizarGraficos() {
    this.chartComposicao?.destroy();
    this.chartForca?.destroy();
    this.chartPerimetros?.destroy();

    const [l0, l1] = this.labelsDatas;
    const indicadores = ['pesoAtual', 'pesoMagro', 'pesoGordo', '% Gordura'];

    this.chartComposicao = new Chart(this.graficoCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Peso Atual', 'Peso Magro', 'Peso Gordo', '% Gordura'],
        datasets: [
          { label: l0, data: indicadores.map(i => this.d1[i]), backgroundColor: 'rgba(82,183,136,0.7)', borderColor: '#52b788', borderWidth: 1 },
          { label: l1, data: indicadores.map(i => this.d2[i]), backgroundColor: 'rgba(45,106,79,0.7)', borderColor: '#2d6a4f', borderWidth: 1 },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' as const, labels: { color: '#cccccc' } } },
        scales: {
          x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
          y: { beginAtZero: true, ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
        },
      },
    });

    this.chartForca = new Chart(this.graficoForcaCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Flexões', 'Abdominais'],
        datasets: [
          { label: l0, data: [this.a1.totalFlexoes ?? 0, this.a1.totalAbdominais ?? 0], backgroundColor: 'rgba(82,183,136,0.7)', borderColor: '#52b788', borderWidth: 1 },
          { label: l1, data: [this.a2.totalFlexoes ?? 0, this.a2.totalAbdominais ?? 0], backgroundColor: 'rgba(45,106,79,0.7)', borderColor: '#2d6a4f', borderWidth: 1 },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Repetições', color: '#cccccc' }, ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
          x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
        },
        plugins: { legend: { position: 'top' as const, labels: { color: '#cccccc' } } },
      },
    });

    const labelsPeri = ['Tórax', 'Cintura', 'Abdome', 'Quadril', 'Antebraços', 'Braços', 'Coxas', 'Panturrilhas'];
    const dataPeri1 = [this.a1.torax ?? 0, this.a1.cintura ?? 0, this.a1.abdome ?? 0, this.a1.quadril ?? 0, this.a1.antebracos ?? 0, this.a1.bracos ?? 0, this.a1.coxas ?? 0, this.a1.panturrilhas ?? 0];
    const dataPeri2 = [this.a2.torax ?? 0, this.a2.cintura ?? 0, this.a2.abdome ?? 0, this.a2.quadril ?? 0, this.a2.antebracos ?? 0, this.a2.bracos ?? 0, this.a2.coxas ?? 0, this.a2.panturrilhas ?? 0];

    if (this.tipoComparacao === 'radar') {
      this.chartPerimetros = new Chart(this.graficoPeriMetrosCanvas.nativeElement.getContext('2d')!, {
        type: 'radar',
        data: {
          labels: labelsPeri,
          datasets: [
            { label: l0, data: dataPeri1, backgroundColor: 'rgba(82,183,136,0.2)', borderColor: '#52b788', borderWidth: 2, pointBackgroundColor: '#52b788' } as any,
            { label: l1, data: dataPeri2, backgroundColor: 'rgba(45,106,79,0.2)', borderColor: '#2d6a4f', borderWidth: 2, pointBackgroundColor: '#2d6a4f' } as any,
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              ticks: { color: '#888888', backdropColor: 'transparent' } as any,
              grid: { color: '#2a2a2a' },
              pointLabels: { color: '#cccccc', font: { size: 11 } },
            } as any,
          },
          plugins: { legend: { position: 'top' as const, labels: { color: '#cccccc' } } },
        },
      });
    } else {
      this.chartPerimetros = new Chart(this.graficoPeriMetrosCanvas.nativeElement.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: labelsPeri,
          datasets: [
            { label: l0, data: dataPeri1, backgroundColor: 'rgba(82,183,136,0.7)', borderColor: '#52b788', borderWidth: 1 },
            { label: l1, data: dataPeri2, backgroundColor: 'rgba(45,106,79,0.7)', borderColor: '#2d6a4f', borderWidth: 1 },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false, ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
            x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
          },
          plugins: { legend: { position: 'top' as const, labels: { color: '#cccccc' } } },
        },
      });
    }
  }

  async compartilhar() {
    const loading = await this.loadingCtrl.create({ message: 'Gerando imagem...' });
    await loading.present();

    try {
      const canvas1 = this.graficoCanvas.nativeElement as HTMLCanvasElement;
      const canvas2 = this.graficoPeriMetrosCanvas.nativeElement as HTMLCanvasElement;
      const canvas3 = this.graficoForcaCanvas.nativeElement as HTMLCanvasElement;
      const PAD = 16;
      const W = Math.max(canvas1.width, canvas2.width, canvas3.width);

      const output = document.createElement('canvas');
      output.width = W;
      output.height = canvas1.height + canvas2.height + canvas3.height + PAD * 4;

      const ctx = output.getContext('2d')!;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, output.width, output.height);
      ctx.drawImage(canvas1, 0, PAD);
      ctx.drawImage(canvas2, 0, canvas1.height + PAD * 2);
      ctx.drawImage(canvas3, 0, canvas1.height + canvas2.height + PAD * 3);

      const fileName = `comparacao-${Date.now()}.png`;

      if (Capacitor.isNativePlatform()) {
        const base64 = output.toDataURL('image/png').split(',')[1];
        await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
        const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
        await Share.share({ title: 'Comparativo de Avaliações', files: [uri] });
        await Filesystem.deleteFile({ path: fileName, directory: Directory.Cache });
      } else {
        const blob = await new Promise<Blob>((resolve, reject) =>
          output.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png')
        );
        const file = new File([blob], fileName, { type: 'image/png' });
        const nav = navigator as any;
        if (nav.canShare?.({ files: [file] })) {
          await nav.share({ files: [file], title: 'Comparativo de Avaliações' });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } finally {
      await loading.dismiss();
    }
  }

  dismiss() {}

  fechar() {
    this.modalCtrl.dismiss();
  }
}
