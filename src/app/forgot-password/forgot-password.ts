import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  router = inject(Router);
  
  email = signal('');
  otp = signal('');
  currentStep = signal(0);
  showSuccessMessage = signal(false);

  submitEmail() {
    if (this.email()) {
      this.currentStep.set(1);
    }
  }

  verifyOTP() {
    if (this.otp()) {
      this.showSuccessMessage.set(true);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
