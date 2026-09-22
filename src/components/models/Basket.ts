import { IProduct } from "../../types";

export class Basket {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  isInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
