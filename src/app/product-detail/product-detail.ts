import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartStore } from '../services/cart-store.service';
import { Product, ProductStore } from '../services/product-store.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  protected readonly productStore = inject(ProductStore);
  protected readonly cartStore = inject(CartStore);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly productId = signal<string | null>(null);
  protected readonly buyMode = signal<boolean>(false);
  protected readonly buyerPhone = signal<string>('');
  protected readonly purchaseMessage = signal<string | null>(null);
  protected readonly purchaseError = signal<string | null>(null);
  readonly ratingInput = signal<number | null>(null);
  protected readonly ratingMessage = signal<string | null>(null);
  protected readonly ratingError = signal<string | null>(null);

  protected readonly product = computed<Product | undefined>(() => {
    const id = this.productId();
    if (!id) {
      return undefined;
    }
    return this.productStore.products().find((item) => item.id === id);
  });

  protected readonly canRate = computed(() => {
    const user = this.authService.user();
    return this.authService.isLoggedIn() && user?.role === 'customer';
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id);
    this.buyMode.set(this.route.snapshot.queryParamMap.get('buy') === 'true');
  }

  protected addToCart(productId: string): void {
    if (!this.authService.isLoggedIn() || this.authService.user()?.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }

    this.cartStore.add(productId);
  }

  protected buyNow(productId: string): void {
    if (!this.authService.isLoggedIn() || this.authService.user()?.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }

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

  submitRating(): void {
    const currentProduct = this.product();
    if (!currentProduct) {
      this.ratingError.set('Select a product before submitting a rating.');
      this.ratingMessage.set(null);
      return;
    }

    if (!this.canRate()) {
      this.ratingError.set('Please log in as a customer to submit a rating.');
      this.ratingMessage.set(null);
      return;
    }

    const selectedRating = this.ratingInput();
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      this.ratingError.set('Choose a rating from 1 to 5 stars.');
      this.ratingMessage.set(null);
      return;
    }

    const previousRating = currentProduct.rating ?? 0;
    const previousCount = currentProduct.ratingCount ?? 0;
    const nextCount = previousCount + 1;
    const nextRating = previousCount === 0 ? selectedRating : (previousRating * previousCount + selectedRating) / nextCount;

    const updatedProduct: Product = {
      ...currentProduct,
      rating: Number(nextRating.toFixed(1)),
      ratingCount: nextCount,
    };

    this.productStore.update(updatedProduct);
    this.ratingInput.set(null);
    this.ratingError.set(null);
    this.ratingMessage.set(`Thanks for your ${selectedRating}-star rating.`);
  }
}