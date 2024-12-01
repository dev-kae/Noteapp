import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    console.log('Login attempt with:', this.credentials.email);
    this.authService.login(this.credentials.email, this.credentials.password).subscribe(
      response => {
        console.log('Login response:', response);
        this.router.navigate(['/home']);
      },
      error => {
        this.errorMessage = 'Invalid credentials';
      }
    );
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
