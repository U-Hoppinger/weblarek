import { ProductCard } from "./ProductCard";
import { IProductCardData } from "../../types";
import { IEvents } from "../base/Events";

interface ICatalogCardData extends IProductCardData {
  category: string;
  image: string;
  imageAlt: string;
}

export class CatalogCard extends ProductCard<ICatalogCardData> {
  constructor(container: HTMLElement, events: IEvents, productId: string) {
    super(container);

    this.container.addEventListener("click", () => {
      events.emit("catalog:select", { id: productId });
    });
  }
}
