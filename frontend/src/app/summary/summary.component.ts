import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';

declare var Chart: any;

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    chartDescription = '';
    chart: any;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.getChartLocations().subscribe({
            next: (data) => {
                this.chartDescription = data.description;
                this.renderChart(data);
            },
            error: (err) => console.error(err)
        });
    }

    renderChart(apiData: any): void {
        const ctx = document.getElementById('geoChart') as HTMLCanvasElement;
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: apiData.labels,
                datasets: [{
                    label: '# of Studies',
                    data: apiData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Geographic Distribution of Studies'
                    }
                }
            }
        });
    }
}
