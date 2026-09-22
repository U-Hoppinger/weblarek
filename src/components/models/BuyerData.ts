import { IBuyer, TPayment } from "../../types";

export class BuyerData {
  payment: TPayment | null = null;
  address: string = "";
  phone: string = "";
  email: string = "";

  setBuyerData(data: Partial<IBuyer>): void {
    Object.assign(this, data);
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment as TPayment,
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
  }

  validateData(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address) errors.address = "Укажите адрес доставки";
    if (!this.phone) errors.phone = "Укажите номер телефона";
    if (!this.email) errors.email = "Укажите электронную почту";

    return errors;
  }
}
