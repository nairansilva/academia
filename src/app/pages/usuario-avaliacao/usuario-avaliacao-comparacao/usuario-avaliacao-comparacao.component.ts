import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-usuario-avaliacao-comparacao',
  templateUrl: './usuario-avaliacao-comparacao.component.html',
  styleUrls: ['./usuario-avaliacao-comparacao.component.scss'],
})
export class UsuarioAvaliacaoComparacaoComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  @Input() dados: any[] = [];
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoForcaCanvas')
  graficoForcaCanvas!: ElementRef<HTMLCanvasElement>;

  labels: string[] = [];
  chart: Chart | undefined;

  ngOnInit() {
    this.labels = this.dados.map((a) =>
      new Date(a.dataAvaliacao).toLocaleDateString()
    );
  }

  ngAfterViewInit() {
    if (this.dados.length !== 2) return;

    const [a1, a2] = this.dados;
    const labelsDatas = [
      new Date(a1.dataAvaliacao).toLocaleDateString(),
      new Date(a2.dataAvaliacao).toLocaleDateString(),
    ];

    // Função para calcular composição
    const mapDados = (a: any) => {
      const pesoAtual = a.pesoAtual ?? 0;
      const somaDobras = [
        a.subscapular,
        a.tricipital,
        a.peitoral,
        a.axilarMedia,
        a.supraIliaca,
        a.abdominal,
        a.coxa,
      ].reduce((soma, val) => soma + (val ?? 0), 0);

      const idade = 30;
      const sexo = 'M';

      let densidade = 1;
      if (sexo === 'M') {
        densidade =
          1.112 -
          0.00043499 * somaDobras +
          0.00000055 * Math.pow(somaDobras, 2) -
          0.00028826 * idade;
      } else {
        densidade =
          1.097 -
          0.00046971 * somaDobras +
          0.00000056 * Math.pow(somaDobras, 2) -
          0.00012828 * idade;
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

    const d1: any = mapDados(a1);
    const d2: any = mapDados(a2);

    const indicadores = ['pesoAtual', 'pesoMagro', 'pesoGordo', '% Gordura'];

    const datasets = [
      {
        label: labelsDatas[0],
        data: indicadores.map((i) => d1[i]),
        backgroundColor: 'rgba(56, 128, 255, 0.7)',
      },
      {
        label: labelsDatas[1],
        data: indicadores.map((i) => d2[i]),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ];

    this.chart = new Chart(this.graficoCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Peso Atual', 'Peso Magro', 'Peso Gordo', '% Gordura'],
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Novo gráfico de força com agrupamento por avaliação
    const labels = ['Flexões', 'Abdominais'];

    const datasetsForca = [
      {
        label: labelsDatas[0],
        data: [
          a1.totalFlexoes ?? 0,
          a1.totalAbdominais ?? 0,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: labelsDatas[1],
        data: [
          a2.totalFlexoes ?? 0,
          a2.totalAbdominais ?? 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ];

    new Chart(this.graficoForcaCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels,
        datasets: datasetsForca,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Repetições',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }


  dismiss() {
    // fechar modal se precisar
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
