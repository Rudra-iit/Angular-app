import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  quality: string;
  price: number;
  imageUrl: string;
}

const PRODUCTS_STORAGE_KEY = 'login-app-products';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly productsSignal = signal<Product[]>(this.loadProducts());

  readonly products = this.productsSignal;

  private loadProducts(): Product[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return [];
    }
  }

  private saveProducts(products: Product[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }

  add(product: Product): void {
    this.productsSignal.update((products) => {
      const next = [...products, product];
      this.saveProducts(next);
      return next;
    });
  }

  update(product: Product): void {
    this.productsSignal.update((products) => {
      const next = products.map((item) => (item.id === product.id ? product : item));
      this.saveProducts(next);
      return next;
    });
  }

  delete(id: string): void {
    this.productsSignal.update((products) => {
      const next = products.filter((item) => item.id !== id);
      this.saveProducts(next);
      return next;
    });
  }
}
