import { Injectable, signal } from '@angular/core';

export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'login-app-cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly cartItemsSignal = signal<CartItem[]>(this.loadCartItems());
  readonly cartItems = this.cartItemsSignal;

  private loadCartItems(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  }

  private saveCartItems(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private persist(items: CartItem[]): CartItem[] {
    this.saveCartItems(items);
    return items;
  }

  add(productId: string, quantity = 1): void {
    this.cartItemsSignal.update((items) => {
      const existing = items.find((item) => item.productId === productId);
      if (!existing) {
        return this.persist([...items, { productId, quantity }]);
      }

      return this.persist(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    this.cartItemsSignal.update((items) =>
      this.persist(
        items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    );
  }

  remove(productId: string): void {
    this.cartItemsSignal.update((items) => this.persist(items.filter((item) => item.productId !== productId)));
  }

  clear(): void {
    this.cartItemsSignal.set(this.persist([]));
  }
}
