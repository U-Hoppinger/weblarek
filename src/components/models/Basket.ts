import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class Basket {
  constructor(protected readonly events: IEvents) {}

  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
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
