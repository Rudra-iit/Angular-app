import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user = {
    email: '',
    password: ''
  };
  storedUser = {
    email: 'bsse1518@gmail.com',
    password: 'Bsse1518&IIT'
  };
  loginValid: boolean = true;
  router = inject(Router);
  validateLogin(email: string, password: string): Boolean{
    return email === this.storedUser.email && password === this.storedUser.password;
  };
  login() {
    if (this.validateLogin(this.user.email, this.user.password)) {
      localStorage.setItem('loggedInUser', JSON.stringify(this.user.email));
      this.loginValid = true;
      this.router.navigate(['/dashboard']);
    }
    else {
      this.loginValid = false;
    }
  };
}
