import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";

export interface IPreviewData extends IProduct {
  inBasket: boolean;
}

export class PreviewCard extends ProductCard {
  private readonly descriptionElement: HTMLElement;
  private readonly button: HTMLButtonElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>("#card-preview"), events);
    this.descriptionElement = this.container.querySelector<HTMLElement>(".card__text")!;
    this.button = this.container.querySelector<HTMLButtonElement>(".card__button")!;
    this.button.addEventListener("click", () => {
      this.events.emit("preview:toggle", { id: this.container.dataset.id ?? "" });
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    this.button.textContent = this.button.disabled
      ? "Недоступно"
      : value ? "Удалить из корзины" : "Купить";
  }

  override set price(value: number | null) {
    super.price = value;
    this.button.disabled = value === null;
    if (this.button.disabled) this.button.textContent = "Недоступно";
  }

  override render(data: Partial<IPreviewData>): HTMLElement {
    // product.price должен быть установлен до inBasket.
    const { inBasket, ...product } = data;
    super.render(product);
    if (inBasket !== undefined) this.inBasket = inBasket;
    return this.container;
  }
}
