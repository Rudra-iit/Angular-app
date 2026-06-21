import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected readonly fb = inject(FormBuilder);
  protected readonly productStore = inject(ProductStore);

  protected readonly productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    quality: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
  });

  protected readonly products = this.productStore.products;
  protected readonly selectedProductId = signal<string | null>(null);

  protected readonly productCount = computed(() => this.products().length);
  protected readonly saveLabel = computed(() =>
    this.selectedProductId() ? 'Update product' : 'Add product'
  );

  protected addOrUpdateProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const raw = this.productForm.value as {
      name: string;
      description: string;
      quality: string;
      price: number;
      imageUrl: string;
    };

    const product: Product = {
      id:
        this.selectedProductId() ?? `${Date.now()}-${Math.random()}`.replace(/\D/g, ''),
      name: raw.name.trim(),
      description: raw.description.trim(),
      quality: raw.quality.trim(),
      price: Number(raw.price),
      imageUrl: raw.imageUrl.trim(),
    };

    if (this.selectedProductId()) {
      this.productStore.update(product);
    } else {
      this.productStore.add(product);
    }

    this.resetForm();
  }

  protected selectProduct(product: Product): void {
    this.selectedProductId.set(product.id);
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      quality: product.quality,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  }

  protected resetForm(): void {
    this.selectedProductId.set(null);
    this.productForm.reset({
      name: '',
      description: '',
      quality: '',
      price: 0,
      imageUrl: '',
    });
  }

  protected deleteProduct(product: Product): void {
    this.productStore.delete(product.id);
    if (this.selectedProductId() === product.id) {
      this.resetForm();
    }
  }
}
