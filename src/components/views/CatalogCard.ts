import { ProductCard } from "./ProductCard";
import { IProductCardData } from "../../types";

interface ICatalogCardData extends IProductCardData {
  category: string;
  image: string;
  imageAlt: string;
}

export class CatalogCard extends ProductCard<ICatalogCardData> {
  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.container.addEventListener("click", onClick);
  }
}
