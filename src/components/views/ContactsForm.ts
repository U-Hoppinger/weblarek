import { Form, IFormData } from "./Form";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLFormElement>("#contacts"), events, "contacts:change", "contacts:submit");
    this.emailInput = this.formElement.querySelector<HTMLInputElement>('input[name="email"]')!;
    this.phoneInput = this.formElement.querySelector<HTMLInputElement>('input[name="phone"]')!;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
