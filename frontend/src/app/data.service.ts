import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getDashboardSummary(): Observable<any> {
        return this.http.get(`${this.baseUrl}/dashboard/summary`, { headers: this.getHeaders() });
    }

    getChartLocations(): Observable<any> {
        return this.http.get(`${this.baseUrl}/chart/locations`, { headers: this.getHeaders() });
    }

    getChartConditions(): Observable<any> {
        return this.http.get(`${this.baseUrl}/chart/conditions`, { headers: this.getHeaders() });
    }
}
