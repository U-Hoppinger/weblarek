import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IFormData } from "../../types";

interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "contacts:change", "contacts:submit");

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.formElement,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.formElement,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
