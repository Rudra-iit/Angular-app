import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly productStore = inject(ProductStore);
  protected readonly products = this.productStore.products;
  protected readonly productCount = computed(() => this.products().length);
}
