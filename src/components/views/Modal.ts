import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<never> {
  private readonly contentElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  private readonly handleEscape = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.close();
    }
  };

  constructor(container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.contentElement.replaceChildren(content);
    this.container.classList.add("modal_active");

    document.addEventListener("keydown", this.handleEscape);

    this.closeButton.focus();
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();

    document.removeEventListener("keydown", this.handleEscape);
  }
}
