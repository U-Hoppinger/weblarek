import { IEvents } from "../base/Events";
import { IBuyer, TPayment, TFormErrors } from "../../types";

export class BuyerData {
  constructor(protected readonly events: IEvents) {}

  protected payment: TPayment | null = null;
  protected address: string = "";
  protected phone: string = "";
  protected email: string = "";

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    this.events.emit("buyer:changed");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit("buyer:changed");
  }

  validateData(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this.phone.trim()) errors.phone = "Укажите номер телефона";
    if (!this.email.trim()) errors.email = "Укажите электронную почту";

    return errors;
  }
}
