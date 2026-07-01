import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly productStore = inject(ProductStore);
  protected readonly products = this.productStore.products;
  protected readonly searchInput = signal('');

  protected readonly categories = computed(() => {
    const categories = new Set<string>();
    for (const product of this.products()) {
      categories.add(product.category?.trim() || 'Uncategorized');
    }
    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  });

  protected readonly categoryCount = computed(() => this.categories().length);

  protected readonly matchingProducts = computed(() => {
    const term = this.searchInput().trim().toLowerCase();
    if (!term) {
      return [];
    }

    return this.products().filter((product) => {
      const haystack = [product.name, product.description, product.details, product.category, product.quality]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  });

  protected onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchInput.set(this.searchInput().trim());
  }
}
