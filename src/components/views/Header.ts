import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<{ counter: number }> {
  private readonly counterElement: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.counterElement = this.container.querySelector<HTMLElement>(".header__basket-counter")!;
    this.basketButton = this.container.querySelector<HTMLButtonElement>(".header__basket")!;
    this.basketButton.setAttribute("aria-label", "Открыть корзину");
    this.basketButton.addEventListener("click", () => events.emit("basket:open"));
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
