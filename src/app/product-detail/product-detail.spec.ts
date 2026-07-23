import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductDetail } from './product-detail';
import { ProductStore } from '../services/product-store.service';
import { AuthService } from '../services/auth.service';

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
  let component: ProductDetail;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'login-app-products',
      JSON.stringify([
        {
          id: 'p1',
          name: 'Laptop',
          description: 'Great laptop',
          details: '16GB RAM',
          quality: 'Excellent',
          category: 'Electronics',
          price: 999,
          imageUrl: '',
          imageUrls: ['https://example.com/one.jpg', 'https://example.com/two.jpg', 'https://example.com/three.jpg'],
          warranty: '1 year',
        },
      ])
    );
    localStorage.setItem(
      'login-app-current-user',
      JSON.stringify({ username: 'customer', role: 'customer' })
    );

    TestBed.configureTestingModule({
      imports: [ProductDetail, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 'p1' },
              queryParamMap: { get: () => null },
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submits a customer rating and updates the product average', () => {
    component.ratingInput.set(4);
    component.submitRating();

    const productStore = TestBed.inject(ProductStore);
    const updatedProduct = productStore.products().find((product) => product.id === 'p1');

    expect(updatedProduct?.rating).toBe(4);
    expect(updatedProduct?.ratingCount).toBe(1);
  });

  it('switches the main image when a thumbnail is selected', () => {
    component.selectedImageIndex.set(2);

    expect(component.selectedImage()).toBe('https://example.com/three.jpg');
  });
});
