import { IApi } from "../types";
import { IProductList, IOrder, IOrderResult } from "../types";

export class LarekAPI {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  // Запрашиваем каталог товаров
  getProductList(): Promise<IProductList> {
    return this._baseApi.get<IProductList>("/product/");
  }

  // Отправляем заказ
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._baseApi.post<IOrderResult>("/order/", order);
  }
}
