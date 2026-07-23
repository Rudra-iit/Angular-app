import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { ProductStore } from '../services/product-store.service';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})
export class Category {
  private readonly route = inject(ActivatedRoute);
  private readonly productStore = inject(ProductStore);
  private readonly cartStore = inject(CartStore);

  protected readonly products = this.productStore.products;
  protected readonly selectedCategory = computed(() => this.route.snapshot.queryParamMap.get('category') || 'All Categories');
  protected readonly searchInput = signal('');
  protected readonly categoryLinks = computed(() => {
    const categories = new Set<string>();

    for (const product of this.products()) {
      categories.add(product.category?.trim() || 'Uncategorized');
    }

    return ['All Categories', ...Array.from(categories).filter((category) => category !== 'All Categories').sort((a, b) => a.localeCompare(b))];
  });

  protected readonly categoryProducts = computed(() => {
    const category = this.selectedCategory();
    const term = this.searchInput().trim().toLowerCase();
    const baseProducts = !category || category === 'All Categories'
      ? this.products()
      : this.products().filter((product) => (product.category?.trim() || 'Uncategorized') === category);

    if (!term) {
      return baseProducts;
    }

    return baseProducts.filter((product) => {
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

  protected addToCart(productId: string): void {
    this.cartStore.add(productId);
  }
}
