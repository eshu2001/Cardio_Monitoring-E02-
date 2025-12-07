import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    username = '';
    password = '';
    errorMessage = '';
    successMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    register(): void {
        this.authService.register(this.username, this.password).subscribe({
            next: () => {
                this.successMessage = 'Registration successful! Redirecting to login...';
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                console.error(err); // Log full error for debugging
                this.errorMessage = err.error?.message || err.message || 'Registration failed. Is the backend running?';
            }
        });
    }
}
