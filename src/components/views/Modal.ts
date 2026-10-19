import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

// Модальное окно не является родителем для компонентов содержимого.
export class Modal extends Component<never> {
  private readonly contentElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.contentElement = container.querySelector<HTMLElement>(".modal__content")!;
    this.closeButton = container.querySelector<HTMLButtonElement>(".modal__close")!;
    this.closeButton.addEventListener("click", () => events.emit("modal:close"));
    container.addEventListener("click", (event) => {
      if (event.target === container) events.emit("modal:close");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && container.classList.contains("modal_active")) {
        events.emit("modal:close");
      }
    });
  }

  open(content: HTMLElement): void {
    this.contentElement.replaceChildren(content);
    this.container.classList.add("modal_active");
    this.closeButton.focus();
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
  }
}
