import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private router = inject(Router);

  logout() {
    // Clear any stored auth data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    // Navigate to login
    this.router.navigate(['/login']);
  }
}
