import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  quality: string;
  price: number;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly productsSignal = signal<Product[]>([]);

  readonly products = this.productsSignal;

  add(product: Product): void {
    this.productsSignal.update((products) => [...products, product]);
  }

  update(product: Product): void {
    this.productsSignal.update((products) =>
      products.map((item) => (item.id === product.id ? product : item))
    );
  }

  delete(id: string): void {
    this.productsSignal.update((products) => products.filter((item) => item.id !== id));
  }
}
