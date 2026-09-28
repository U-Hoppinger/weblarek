import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { BuyerData } from "./components/models/BuyerData";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekAPI } from "./components/LarekAPI";

// --- Тест Каталога ---
const catalog = new Catalog();
catalog.setProducts(apiProducts.items);
console.log("1. [Каталог] Все товары:", catalog.getProducts());
console.log(
  "2. [Каталог] Поиск товара по ID:",
  catalog.getProductById(apiProducts.items[0].id),
);

catalog.setPreview(apiProducts.items[0]);
console.log("2.1. [Каталог] Получение превью товара:", catalog.getPreview());

// --- Тест Корзины ---
const basket = new Basket();
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log("3. [Корзина] Содержимое:", basket.getItems());
console.log("4. [Корзина] Итоговая сумма:", basket.getTotalPrice());

console.log("4.1. [Корзина] Общее количество товаров:", basket.getTotalCount());
console.log(
  "4.2. [Корзина] Есть ли товар в корзине?:",
  basket.isInBasket(apiProducts.items[0].id),
);

basket.removeItem(apiProducts.items[0].id);
console.log("5. [Корзина] После удаления первого товара:", basket.getItems());

basket.clear();
console.log("5.1. [Корзина] После полной очистки:", basket.getItems());

// --- Тест Покупателя ---
const buyer = new BuyerData();
buyer.setBuyerData({ email: "test@test.ru", phone: "+79991234567" });
console.log("6. [Покупатель] Текущие данные:", buyer.getBuyerData());
console.log(
  "7. [Покупатель] Ошибки валидации (должен ругаться на адрес и оплату):",
  buyer.validateData(),
);

buyer.clearData();
console.log("7.1. [Покупатель] Данные после очистки:", buyer.getBuyerData());

const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

api
  .getProductList()
  .then((res) => {
    catalog.setProducts(res.items);
    console.log(
      "8. [Сервер] Настоящий каталог успешно загружен:",
      catalog.getProducts(),
    );
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога:", err);
  });
