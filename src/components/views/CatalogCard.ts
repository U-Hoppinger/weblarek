import { ProductCard } from "./ProductCard";
import { IProductCardData } from "../../types";
import { cloneTemplate } from "../../utils/utils";

interface ICatalogCardData extends IProductCardData {
  category: string;
  image: string;
  imageAlt: string;
}

export class CatalogCard extends ProductCard<ICatalogCardData> {
  constructor(onClick: () => void) {
    super(cloneTemplate<HTMLElement>("#card-catalog"));

    this.container.addEventListener("click", onClick);
  }
}
