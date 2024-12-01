import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log('Login request:', { email, password });
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        console.log('Login response:', response);
        localStorage.setItem('user', JSON.stringify(response));
      })
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  updatePassword(newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { newPassword });
  }

  logout() {
    localStorage.removeItem('user');
  }

  verifyAndUpdatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }
  
}
