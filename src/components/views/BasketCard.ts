import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";
import { IProduct } from "../../types";

export interface IBasketCardData extends IProduct {
  index: number;
}

export class BasketCard extends Card {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    super(cloneTemplate<HTMLElement>("#card-basket"));
    this.indexElement = this.container.querySelector<HTMLElement>(".basket__item-index")!;
    this.deleteButton = this.container.querySelector<HTMLButtonElement>(".basket__item-delete")!;
    this.deleteButton.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this.container.dataset.id ?? "" });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  override render(data: Partial<IBasketCardData>): HTMLElement {
    return super.render(data);
  }
}
