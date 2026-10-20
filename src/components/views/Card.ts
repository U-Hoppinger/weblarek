import { Component } from "../base/Component";
import { IProductCardData } from "../../types";
import { ensureElement } from "../../utils/utils";

export abstract class Card<
  T extends IProductCardData = IProductCardData,
> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );

    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}
