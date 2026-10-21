import { Card } from "./Card";
import { IProductCardData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasketCardData extends IProductCardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, productId: string) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", () => {
      events.emit("basket:remove", { id: productId });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
