import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class Catalog {
  constructor(protected readonly events: IEvents) {}

  protected products: IProduct[] = [];
  protected previewProduct: IProduct | null = null;

  setProducts(items: IProduct[]): void {
    this.products = items;
    this.events.emit("catalog:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.previewProduct = item;
    this.events.emit("catalog:preview-changed");
  }

  getPreview(): IProduct | null {
    return this.previewProduct;
  }
}
