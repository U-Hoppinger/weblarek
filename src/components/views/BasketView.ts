import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
  isEmpty: boolean;
}

export class BasketView extends Component<IBasketViewData> {
  private readonly listElement: HTMLUListElement;
  private readonly totalElement: HTMLElement;
  private readonly checkoutButton: HTMLButtonElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>("#basket"));
    this.listElement = this.container.querySelector<HTMLUListElement>(".basket__list")!;
    this.totalElement = this.container.querySelector<HTMLElement>(".basket__price")!;
    this.checkoutButton = this.container.querySelector<HTMLButtonElement>(".basket__button")!;
    this.checkoutButton.addEventListener("click", () => events.emit("basket:checkout"));
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
