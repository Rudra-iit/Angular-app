import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['customer' as UserRole, Validators.required],
  });

  protected readonly error = signal<string | null>(null);
  protected readonly isAdmin = computed(() => this.authService.isAdmin());
  protected readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.error.set('Please enter a username, password, and role.');
      return;
    }

    const { username, password, role } = this.loginForm.value as {
      username: string;
      password: string;
      role: UserRole;
    };

    const success = this.authService.login(username, password, role);

    if (success) {
      this.error.set(null);
      this.router.navigateByUrl(role === 'admin' ? '/admin' : '/dashboard');
      return;
    }

    this.error.set('Invalid credentials. Please try again.');
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/dashboard');
  }
}
