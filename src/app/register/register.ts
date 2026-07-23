import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

const REGISTER_FORM_STORAGE_KEY = 'login-app-register-form';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['customer' as UserRole, Validators.required],
  });

  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadFormState();
    this.registerForm.valueChanges.subscribe((value) => {
      sessionStorage.setItem(REGISTER_FORM_STORAGE_KEY, JSON.stringify(value));
    });
  }

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error.set('Please complete all fields before registering.');
      return;
    }

    const { username, password, role } = this.registerForm.value as {
      username: string;
      password: string;
      role: UserRole;
    };

    const success = this.authService.register(username, password, role);

    if (!success) {
      this.error.set('That username is already registered. Please choose another username.');
      return;
    }

    sessionStorage.removeItem(REGISTER_FORM_STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }

  private loadFormState(): void {
    const saved = sessionStorage.getItem(REGISTER_FORM_STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const value = JSON.parse(saved) as Partial<{
        username: string;
        password: string;
        role: UserRole;
      }>;

      this.registerForm.patchValue({
        username: value.username ?? '',
        password: value.password ?? '',
        role: value.role ?? 'customer',
      });
    } catch {
      // Ignore invalid saved state.
    }
  }
}
