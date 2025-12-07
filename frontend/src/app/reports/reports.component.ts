import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

declare var d3: any;

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
    chartDescription = '';
    chart: any;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.getChartConditions().subscribe({
            next: (data) => {
                this.chartDescription = data.description;
                this.renderChart(data);
            },
            error: (err) => console.error(err)
        });
    }

    renderChart(apiData: any): void {
        const data = apiData.labels.map((label: string, i: number) => ({
            label: label,
            value: apiData.data[i]
        }));

        d3.select('#chart').select('svg').remove(); // Clear previous

        const width = 960;
        const height = 450;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .append("g")
            .attr("class", "slices");

        const svgContainer = d3.select("#chart svg").append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Note: The user provided code appends g classes separately but logic needs them in correct container
        // To match user snippet structure:
        const mainG = svgContainer;

        mainG.append("g").attr("class", "slices");
        mainG.append("g").attr("class", "labels");
        mainG.append("g").attr("class", "lines");

        const pie = d3.layout.pie().sort(null).value((d: any) => d.value);

        const arc = d3.svg.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
        const outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

        const key = (d: any) => d.data.label;

        // Custom medical color palette
        const color = d3.scale.ordinal()
            .domain(apiData.labels)
            .range(["#0096c7", "#48cae4", "#90e0ef", "#ade8f4", "#0077b6", "#023e8a", "#03045e"]);

        /* ------- PIE SLICES -------*/
        const slice = mainG.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", (d: any) => color(d.data.label))
            .attr("class", "slice")
            .attr("d", arc); // Initial draw

        /* ------- TEXT LABELS -------*/
        const text = mainG.select(".labels").selectAll("text")
            .data(pie(data), key);

        function midAngle(d: any) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text((d: any) => d.data.label)
            .attr("transform", (d: any) => {
                const pos = outerArc.centroid(d);
                pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            })
            .style("text-anchor", (d: any) => midAngle(d) < Math.PI ? "start" : "end")
            .style("font-size", "12px"); // Add font size for readability

        /* ------- SLICE TO TEXT POLYLINES -------*/
        const polyline = mainG.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline.enter()
            .append("polyline")
            .style("opacity", ".3")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .style("fill", "none")
            .attr("points", (d: any) => {
                const pos = outerArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos];
            });
    }
}
