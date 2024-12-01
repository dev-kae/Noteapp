import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  credentials = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  
goToLogin() {
  this.router.navigate(['/login']);
}

  async signup() {
    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }
  
    try {
      await this.authService.signup(
        this.credentials.email,
        this.credentials.password
      );
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Erro ao criar conta';
    }
  }
}
