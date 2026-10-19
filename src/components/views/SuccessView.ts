import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

export class SuccessView extends Component<{ total: number }> {
  private readonly totalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>("#success"));
    this.totalElement = this.container.querySelector<HTMLElement>(".order-success__description")!;
    this.closeButton = this.container.querySelector<HTMLButtonElement>(".order-success__close")!;
    this.closeButton.addEventListener("click", () => events.emit("success:close"));
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
