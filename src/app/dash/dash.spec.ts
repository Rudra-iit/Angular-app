import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { ProductStore } from "../services/product-store.service";
import { Dashboard } from "./dash";

describe("Dashboard", () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders category links instead of product cards", () => {
    const productStore = TestBed.inject(ProductStore);
    productStore.products.set([
      {
        id: "1",
        name: "Laptop",
        description: "Great laptop",
        details: "",
        quality: "Premium",
        category: "Electronics",
        price: 1000,
        imageUrl: "",
        warranty: null,
      },
    ]);

    fixture.detectChanges();

    const categoryLinks = fixture.nativeElement.querySelectorAll("a.category-link");
    expect(categoryLinks.length).toBe(1);
    expect(categoryLinks[0].textContent).toContain("Electronics");
    expect(fixture.nativeElement.textContent).not.toContain("View details");
  });

  it("shows matching products when a search term is submitted", () => {
    const productStore = TestBed.inject(ProductStore);
    productStore.products.set([
      {
        id: "1",
        name: "Gaming Laptop",
        description: "Fast laptop",
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
        description: "Ceramic mug",
        details: "",
        quality: "Standard",
        category: "Home",
        price: 15,
        imageUrl: "",
        warranty: null,
      },
    ]);

    const dashboardComponent = component as unknown as {
      searchInput: { set: (value: string) => void };
      onSearchSubmit: (event: Event) => void;
    };

    dashboardComponent.searchInput.set("laptop");
    dashboardComponent.onSearchSubmit(new Event("submit"));
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain("Gaming Laptop");
    expect(content).not.toContain("Coffee Mug");
  });

  it("links featured products to their detail page", () => {
    const productStore = TestBed.inject(ProductStore);
    productStore.products.set([
      {
        id: "p1",
        name: "Gaming Laptop",
        description: "Fast laptop",
        details: "",
        quality: "Premium",
        category: "Electronics",
        price: 1200,
        imageUrl: "",
        warranty: null,
      },
    ]);

    fixture.detectChanges();

    const detailLink = fixture.debugElement.queryAll(By.directive(RouterLink)).find((link) => link.attributes["href"] === "/product/p1");

    expect(detailLink).toBeTruthy();
  });

  it("creates router links for the top navigation items", () => {
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const hrefs = links.map((link) => link.attributes["href"]);

    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/admin");
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/login");
    expect(hrefs).toContain("/register");
  });

  it("links the cart control to the cart page", () => {
    fixture.detectChanges();

    const cartLink = fixture.debugElement.queryAll(By.directive(RouterLink)).find((link) => link.attributes["href"] === "/cart");

    expect(cartLink).toBeTruthy();
  });
});
