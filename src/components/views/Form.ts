import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IFormData } from "../../types";
import { ensureElement } from "../../utils/utils";

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

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.formElement,
    );

    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.formElement,
    );

    this.inputs = Array.from(
      this.formElement.querySelectorAll<HTMLInputElement>("input[name]"),
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
