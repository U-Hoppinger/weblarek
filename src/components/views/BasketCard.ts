import { Card } from "./Card";
import { IProductCardData } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IBasketCardData extends IProductCardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
