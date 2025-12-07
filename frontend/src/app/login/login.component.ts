import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    login(): void {
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.errorMessage = 'Invalid credentials. Please try again.';
            }
        });
    }
}
