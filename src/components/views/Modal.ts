import { Component } from "../base/Component";

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

    this.contentElement =
      container.querySelector<HTMLElement>(".modal__content")!;
    this.closeButton =
      container.querySelector<HTMLButtonElement>(".modal__close")!;

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    container.addEventListener("click", (event) => {
      if (event.target === container) {
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
