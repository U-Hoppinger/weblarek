import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Header extends Component<{ counter: number }> {
  private readonly counterElement: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this.basketButton.setAttribute("aria-label", "Открыть корзину");

    this.basketButton.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
