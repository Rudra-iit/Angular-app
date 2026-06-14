import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  email: string;
  password: string;
  username?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4200/users'; // Example backend endpoint
  private http = inject(HttpClient);

  // This would come from your backend in production
  private registeredUsers: User[] = [
    {
      email: 'bsse1518@gmail.com',
      password: 'Bsse1518&IIT',
      username: 'test_user'
    }
  ];

  register(userData: User): Observable<any> {
    // Add to local array (in production, send to backend)
    this.registeredUsers.push(userData);
    return this.http.post(this.apiUrl, userData);
  }

  validateLogin(email: string, password: string): boolean {
    return this.registeredUsers.some(
      user => user.email === email && user.password === password
    );
  }

  getUser(email: string): User | undefined {
    return this.registeredUsers.find(user => user.email === email);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
