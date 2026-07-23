import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductStore } from '../services/product-store.service';
import { HeaderComponent } from '../header/header';

interface Slide {
  productId: number;
  imageUrl: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  templateUrl: './dash.html',
  styleUrls: ['./dash.css'],
})
export class Dashboard implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
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

  protected readonly visibleProducts = computed(() => {
    const term = this.searchInput().trim().toLowerCase();
    if (!term) {
      return this.products();
    }

    return this.matchingProducts();
  });

  protected onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchInput.set(this.searchInput().trim());
  }

  // ---- Carousel & countdown, state-driven (no native DOM manipulation) ----

  // Replace the hardcoded imageUrls/productIds here with whatever the
  // real source of your three hero slides is (e.g. a slice of `products`,
  // or a dedicated `heroSlides` field on ProductStore).
  protected readonly slides: Slide[] = [
    { productId: 1, imageUrl: 'https://img.lazcdn.com/us/domino/6654405a-5a0c-4065-b59a-21f69bdf77dd_BD-1976-688.jpg_2200x2200q80.jpg_.avif' },
    { productId: 2, imageUrl: 'https://img.lazcdn.com/us/domino/3c0f2345-0451-4942-97cd-e73f061a41ba_BD-1976-688.jpg_2200x2200q80.jpg_.avif' },
    { productId: 3, imageUrl: 'https://img.lazcdn.com/us/domino/d69a1db5-83cc-411a-97ce-079437231b8e_BD-1976-688.jpg_2200x2200q80.jpg_.avif' },
  ];

  protected readonly current = signal(0);
  protected readonly remaining = signal(4 * 3600 + 12 * 60 + 37);

  protected readonly clockLabel = computed(() => {
    const r = this.remaining();
    const h = String(Math.floor(r / 3600)).padStart(2, '0');
    const m = String(Math.floor((r % 3600) / 60)).padStart(2, '0');
    const s = String(r % 60).padStart(2, '0');
    return `Ends in ${h}:${m}:${s}`;
  });

  private autoTimer?: number;
  private countdownTimer?: number;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.resetAuto();
      this.countdownTimer = window.setInterval(() => {
        this.remaining.update((r) => Math.max(0, r - 1));
      }, 1000);
    }
  }

  protected goTo(i: number): void {
    const count = this.slides.length;
    if (!count) return;
    this.current.set(((i % count) + count) % count);
    this.resetAuto();
  }

  protected moveSlide(delta: number): void {
    this.goTo(this.current() + delta);
  }

  private resetAuto(): void {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = window.setInterval(() => this.moveSlide(1), 5500) as unknown as number;
  }

  ngOnDestroy(): void {
    if (this.autoTimer) clearInterval(this.autoTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }
}