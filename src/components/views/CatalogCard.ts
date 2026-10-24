import { ProductCard } from "./ProductCard";
import { IProductCardData, ICardActions } from "../../types";

interface ICatalogCardData extends IProductCardData {
  category: string;
  image: string;
  imageAlt: string;
}

export class CatalogCard extends ProductCard<ICatalogCardData> {
  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    this.container.addEventListener("click", actions.onClick);
  }
}
