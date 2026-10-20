import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
  isEmpty: boolean;
}

export class BasketView extends Component<IBasketViewData> {
  private readonly listElement: HTMLUListElement;
  private readonly totalElement: HTMLElement;
  private readonly checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container,
    );

    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.checkoutButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.checkoutButton.addEventListener("click", () => {
      events.emit("basket:checkout");
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set isEmpty(value: boolean) {
    this.checkoutButton.disabled = value;
  }
}
