import { Component } from "../base/Component";
import { IProduct } from "../../types";

// Базовый класс трёх видов карточек: общие элементы и отображение полей.
export abstract class Card extends Component<IProduct> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector<HTMLElement>(".card__title")!;
    this.priceElement = container.querySelector<HTMLElement>(".card__price")!;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? "Бесценно" : `${value} синапсов`;
  }
}
