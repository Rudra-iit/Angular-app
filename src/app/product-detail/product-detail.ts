import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { Product, ProductStore } from '../services/product-store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  protected readonly productStore = inject(ProductStore);
  protected readonly cartStore = inject(CartStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly productId = signal<string | null>(null);
  protected readonly buyMode = signal<boolean>(false);
  protected readonly buyerPhone = signal<string>('');
  protected readonly purchaseMessage = signal<string | null>(null);
  protected readonly purchaseError = signal<string | null>(null);

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
    this.buyMode.set(this.route.snapshot.queryParamMap.get('buy') === 'true');
  }

  protected addToCart(productId: string): void {
    this.cartStore.add(productId);
  }

  protected buyNow(productId: string): void {
    const phone = this.buyerPhone().trim();
    if (!phone) {
      this.purchaseError.set('Please enter a phone number to complete the purchase.');
      this.purchaseMessage.set(null);
      return;
    }

    // Simulate transaction flow.
    this.purchaseError.set(null);
    this.purchaseMessage.set(`Order placed for ${phone}. We will send confirmation shortly.`);
    this.cartStore.add(productId);
    this.buyerPhone.set('');
  }
}
