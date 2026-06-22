import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { Product, ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  protected readonly productStore = inject(ProductStore);
  protected readonly cartStore = inject(CartStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly productId = signal<string | null>(null);

  protected readonly product = computed<Product | undefined>(() => {
    const id = this.productId();
    if (!id) {
      return undefined;
    }
    return this.productStore.products().find((item) => item.id === id);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id);
  }

  protected addToCart(productId: string): void {
    this.cartStore.add(productId);
  }
}
