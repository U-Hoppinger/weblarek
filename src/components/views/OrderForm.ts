import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";
import { TPayment, IFormData } from "../../types";

interface IOrderFormData extends IFormData {
  address: string;
  payment: TPayment | null;
}

export class OrderForm extends Form<IOrderFormData> {
  private readonly onlineButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(events: IEvents) {
    super(
      cloneTemplate<HTMLFormElement>("#order"),
      events,
      "order:change",
      "order:submit",
    );
    this.onlineButton = this.formElement.querySelector<HTMLButtonElement>(
      'button[name="card"]',
    )!;
    this.cashButton = this.formElement.querySelector<HTMLButtonElement>(
      'button[name="cash"]',
    )!;
    this.addressInput = this.formElement.querySelector<HTMLInputElement>(
      'input[name="address"]',
    )!;

    this.onlineButton.addEventListener("click", () =>
      events.emit("order:change", { field: "payment", value: "online" }),
    );
    this.cashButton.addEventListener("click", () =>
      events.emit("order:change", { field: "payment", value: "cash" }),
    );
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.onlineButton.classList.toggle("button_alt-active", value === "online");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }
}
