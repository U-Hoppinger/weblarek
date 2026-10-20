import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IFormData } from "../../types";

export abstract class Form<T extends IFormData> extends Component<T> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorElement: HTMLElement;
  protected readonly inputs: HTMLInputElement[];

  protected constructor(
    container: HTMLFormElement,
    events: IEvents,
    changeEvent: string,
    submitEvent: string,
  ) {
    super(container);

    this.formElement = container;

    this.submitButton = container.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    )!;

    this.errorElement = container.querySelector<HTMLElement>(".form__errors")!;

    this.inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>("input[name]"),
    );

    this.inputs.forEach((input) => {
      input.addEventListener("input", () => {
        events.emit(changeEvent, {
          field: input.name,
          value: input.value,
        });
      });
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      events.emit(submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorElement.textContent = value.join("; ");
  }
}
