import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class SuccessView extends Component<{ total: number }> {
  private readonly totalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
