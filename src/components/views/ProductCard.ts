import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";

/** Общая часть каталожной и подробной карточки. */
export abstract class ProductCard extends Card {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  protected constructor(container: HTMLElement, protected readonly events: IEvents) {
    super(container);
    this.categoryElement = container.querySelector<HTMLElement>(".card__category")!;
    this.imageElement = container.querySelector<HTMLImageElement>(".card__image")!;
  }

  set category(value: string) {
    Object.values(categoryMap).forEach((modifier) => this.categoryElement.classList.remove(modifier));
    const modifier = categoryMap[value as keyof typeof categoryMap] ?? categoryMap["другое"];
    this.categoryElement.classList.add(modifier);
    this.categoryElement.textContent = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? "Товар");
  }

  override render(data: Partial<IProduct>): HTMLElement {
    // Сначала заголовок, затем изображение (для alt-текста).
    const { image, ...rest } = data;
    super.render(rest);
    if (image !== undefined) this.image = image;
    return this.container;
  }
}
