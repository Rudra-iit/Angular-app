import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly productStore = inject(ProductStore);
  protected readonly cartStore = inject(CartStore);
  protected readonly products = this.productStore.products;
  protected readonly productCount = computed(() => this.products().length);

  // 🔍 Search term
  searchTerm = signal<string>('');

  // 📂 Sidebar collapsed state
  isSidebarCollapsed = signal<boolean>(false);

  // 🎯 Selected quality filter
  selectedQuality = signal<string | null>(null);

  // Toggle sidebar open/closed
  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  protected addToCart(productId: string): void {
    this.cartStore.add(productId);
  }

  // Apply quality filter
  filterByQuality(quality: string) {
    this.selectedQuality.set(quality);
  }

  // Filtered products based on search + quality
  filteredProducts = computed(() => {
    let products = this.products();

    // Search filter
    const term = this.searchTerm().toLowerCase();
    if (term) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    // Quality filter
    const quality = this.selectedQuality();
    if (quality) {
      products = products.filter((product) => product.quality === quality);
    }

    return products;
  });
}
