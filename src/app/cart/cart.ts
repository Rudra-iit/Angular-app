import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductStore, Product } from '../services/product-store.service';
import { CartStore } from '../services/cart-store.service';

interface CartProductItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected readonly productStore = inject(ProductStore);
  protected readonly cartStore = inject(CartStore);

  protected readonly cartItems = this.cartStore.cartItems;
  protected readonly products = this.productStore.products;

  protected readonly cartProducts = computed(() =>
    this.cartItems().flatMap((item) => {
      const product = this.products().find((product) => product.id === item.productId);
      return product ? [{ product, quantity: item.quantity }] : [];
    })
  );

  protected readonly totalPrice = computed(() =>
    this.cartProducts().reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0)
  );

  protected readonly phone = signal('');
  protected readonly paymentMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected get isPhoneValid() {
    return /^[0-9]{10,15}$/.test(this.phone());
  }

  protected changeQuantity(productId: string, quantity: number): void {
    this.cartStore.updateQuantity(productId, quantity);
  }

  protected removeItem(productId: string): void {
    this.cartStore.remove(productId);
  }

  protected checkout(): void {
    if (this.cartProducts().length === 0) {
      this.paymentMessage.set('Your cart is empty. Add items before paying.');
      return;
    }

    if (!this.isPhoneValid) {
      this.paymentMessage.set('Enter a valid phone number using only digits.');
      return;
    }

    this.isSubmitting.set(true);
    this.paymentMessage.set('Processing payment...');

    setTimeout(() => {
      this.cartStore.clear();
      this.isSubmitting.set(false);
      this.paymentMessage.set(
        `Payment successful! We will contact you at ${this.phone()}. Thank you for your order.`
      );
      this.phone.set('');
    }, 500);
  }
}
