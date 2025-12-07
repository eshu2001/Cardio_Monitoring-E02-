import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    summaryText = '';
    sourceUrl = '';
    user = '';

    constructor(private dataService: DataService, private authService: AuthService) { }

    ngOnInit(): void {
        this.user = this.authService.getUsername() || 'User';
        this.dataService.getDashboardSummary().subscribe({
            next: (data) => {
                this.summaryText = data.summary;
                this.sourceUrl = data.source;
            },
            error: (err) => console.error(err)
        });
    }
}
