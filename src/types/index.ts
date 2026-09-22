export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}
// Тип для способов оплаты
export type TPayment = "online" | "cash";

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера с каталогом товаров
export interface IProductList {
  total: number;
  items: IProduct[];
}

// Данные, которые отправляются на сервер при заказе
export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

// Ответ сервера об успешном заказе
export interface IOrderResult {
  id: string;
  total: number;
}
