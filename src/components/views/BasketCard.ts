import { Card } from "./Card";
import { IProductCardData } from "../../types";
import { cloneTemplate } from "../../utils/utils";

interface IBasketCardData extends IProductCardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(onDelete: () => void) {
    super(cloneTemplate<HTMLElement>("#card-basket"));

    this.indexElement = this.container.querySelector<HTMLElement>(
      ".basket__item-index",
    )!;

    this.deleteButton = this.container.querySelector<HTMLButtonElement>(
      ".basket__item-delete",
    )!;

    this.deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
