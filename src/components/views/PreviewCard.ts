import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { IProductCardData } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IPreviewCardData extends IProductCardData {
  category: string;
  image: string;
  imageAlt: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class PreviewCard extends ProductCard<IPreviewCardData> {
  private readonly events: IEvents;
  private readonly descriptionElement: HTMLElement;
  private readonly button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.button.addEventListener("click", () => {
      this.events.emit("preview:toggle");
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}
