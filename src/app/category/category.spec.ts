import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { ProductStore } from "../services/product-store.service";
import { Category } from "./category";

describe("Category", () => {
  let component: Category;
  let fixture: ComponentFixture<Category>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Category, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Category);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("shows products that match the submitted search term", () => {
    const productStore = TestBed.inject(ProductStore);
    productStore.products.set([
      {
        id: "1",
        name: "Gaming Laptop",
        description: "A fast laptop",
        details: "",
        quality: "Premium",
        category: "Electronics",
        price: 1200,
        imageUrl: "",
        warranty: null,
      },
      {
        id: "2",
        name: "Coffee Mug",
        description: "A ceramic mug",
        details: "",
        quality: "Standard",
        category: "Home",
        price: 15,
        imageUrl: "",
        warranty: null,
      },
    ]);

    component.searchInput.set("laptop");
    component.onSearchSubmit(new Event("submit"));
    fixture.detectChanges();

    const cardTexts = fixture.nativeElement.textContent;
    expect(cardTexts).toContain("Gaming Laptop");
    expect(cardTexts).not.toContain("Coffee Mug");
  });
});
