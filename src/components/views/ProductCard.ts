import { Card } from "./Card";
import { IProductCardData } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export abstract class ProductCard<T extends IProductCardData> extends Card<T> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
  }

  set category(value: string) {
    Object.values(categoryMap).forEach((modifier) =>
      this.categoryElement.classList.remove(modifier),
    );

    const modifier =
      categoryMap[value as keyof typeof categoryMap] ?? categoryMap["другое"];

    this.categoryElement.classList.add(modifier);
    this.categoryElement.textContent = value;
  }

  set image(value: string) {
    this.imageElement.src = `${CDN_URL}${value}`;
  }

  set imageAlt(value: string) {
    this.imageElement.alt = value;
  }
}
