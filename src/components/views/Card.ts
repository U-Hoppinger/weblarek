import { Component } from "../base/Component";
import { IProductCardData } from "../../types";

export abstract class Card<
  T extends IProductCardData = IProductCardData,
> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector<HTMLElement>(".card__title")!;

    this.priceElement = container.querySelector<HTMLElement>(".card__price")!;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}
