import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/login';
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { username, password }).pipe(
            tap(res => {
                if (res.token) {
                    localStorage.setItem(this.tokenKey, res.token);
                    localStorage.setItem(this.userKey, res.username);
                }
            })
        );
    }

    register(username: string, password: string): Observable<any> {
        return this.http.post<any>('http://localhost:3000/api/register', { username, password });
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUsername(): string | null {
        return localStorage.getItem(this.userKey);
    }
}
