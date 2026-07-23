import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PRODUCT_CATEGORIES, Product, ProductStore } from '../services/product-store.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})

export class Admin {
  protected readonly fb = inject(FormBuilder);
  protected readonly productStore = inject(ProductStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly availableCategories = PRODUCT_CATEGORIES;

  protected readonly productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    details: [''],
    quality: [''],
    category: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    imageUrl2: [''],
    imageUrl3: [''],
    warranty: [''],
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
      details: string;
      quality: string;
      category: string;
      price: number;
      imageUrl?: string;
      imageUrl2?: string;
      imageUrl3?: string;
      warranty: string;
    };

    const imageUrls = [raw.imageUrl, raw.imageUrl2, raw.imageUrl3]
      .map((value) => value?.trim() ?? '')
      .filter((value) => Boolean(value));

    const product: Product = {
      id:
        this.selectedProductId() ?? `${Date.now()}-${Math.random()}`.replace(/\D/g, ''),
      name: raw.name.trim(),
      description: raw.description.trim(),
      details: raw.details.trim(),
      quality: raw.quality.trim(),
      category: raw.category.trim(),
      price: Number(raw.price),
      imageUrl: imageUrls[0] ?? '',
      imageUrls,
      warranty: raw.warranty.trim(),
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
    const imageUrls = product.imageUrls?.filter((value): value is string => Boolean(value)) ?? [];

    this.productForm.setValue({
      name: product.name,
      description: product.description,
      details: product.details,
      quality: product.quality,
      category: product.category,
      price: product.price,
      imageUrl: imageUrls[0] ?? product.imageUrl ?? '',
      imageUrl2: imageUrls[1] ?? '',
      imageUrl3: imageUrls[2] ?? '',
      warranty: product.warranty,
    });
  }

  protected resetForm(): void {
    this.selectedProductId.set(null);
    this.productForm.reset({
      name: '',
      description: '',
      details: '',
      quality: '',
      category: '',
      price: 0,
      imageUrl: '',
      imageUrl2: '',
      imageUrl3: '',
      warranty: '',
    });
  }

  protected deleteProduct(product: Product): void {
    this.productStore.delete(product.id);
    if (this.selectedProductId() === product.id) {
      this.resetForm();
    }
  }

  protected getPrimaryImage(product: Product): string {
    return product.imageUrls?.find((value) => Boolean(value)) ?? product.imageUrl ?? '';
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
