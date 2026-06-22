import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { Product, ProductStore } from '../services/product-store.service';

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
  protected readonly categoryPanels = signal<Record<string, boolean>>({});

  // 🔍 Search term
  searchTerm = signal<string>('');

  // 📂 Sidebar collapsed state
  isSidebarCollapsed = signal<boolean>(true);

  // 🎯 Selected quality filter
  selectedQuality = signal<string | null>(null);

  // 🏷️ Selected category filter
  selectedCategory = signal<string>('All Categories');

  selectedProductId = signal<string | null>(null);

  // Toggle sidebar open/closed
  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  viewDetails(product: any) {
    this.selectedProductId.set(product.id);
  }

  closeDetails() {
    this.selectedProductId.set(null);
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
          product.description?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
      );
    }

    // Quality filter
    const quality = this.selectedQuality();
    if (quality) {
      products = products.filter((product) => product.quality === quality);
    }

    const category = this.selectedCategory();
    if (category && category !== 'All Categories') {
      products = products.filter((product) => {
        const productCategory = product.category?.trim() || 'Uncategorized';
        return productCategory === category;
      });
    }

    return products;
  });

  protected readonly categories = computed(() => {
    const categories = new Set<string>();
    for (const product of this.products()) {
      categories.add(product.category?.trim() || 'Uncategorized');
    }
    return ['All Categories', ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  });

  protected readonly groupedProducts = computed(() => {
    const groups = new Map<string, Product[]>();

    for (const product of this.filteredProducts()) {
      const category = product.category?.trim() || 'Uncategorized';
      groups.set(category, [...(groups.get(category) ?? []), product]);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, products]) => ({ category, products }));
  });

  protected readonly productCount = computed(() => this.products().length);

  protected toggleCategory(category: string): void {
    this.categoryPanels.update((current) => ({
      ...current,
      [category]: !this.isCategoryOpen(category),
    }));
  }

  protected isCategoryOpen(category: string): boolean {
    const state = this.categoryPanels();
    return category in state ? state[category] : true;
  }
}
