import { Card } from "./Card";
import { IProductCardData, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IBasketCardData extends IProductCardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
