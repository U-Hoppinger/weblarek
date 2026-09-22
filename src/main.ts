import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { BuyerData } from "./components/models/BuyerData";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekAPI } from "./components/LarekAPI";

// ==========================================
// ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ
// ==========================================

// --- Тест Каталога ---
const catalog = new Catalog();
catalog.setProducts(apiProducts.items);
console.log("1. [Каталог] Все товары:", catalog.getProducts());
console.log(
  "2. [Каталог] Поиск товара по ID:",
  catalog.getProductById(apiProducts.items[0].id),
);

// --- Тест Корзины ---
const basket = new Basket();
// Добавляем первые два товара из тестовых данных
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log("3. [Корзина] Содержимое:", basket.getItems());
console.log("4. [Корзина] Итоговая сумма:", basket.getTotalPrice());
// Удаляем первый товар
basket.removeItem(apiProducts.items[0].id);
console.log("5. [Корзина] После удаления первого товара:", basket.getItems());

// --- Тест Покупателя ---
const buyer = new BuyerData();
// Заполняем только половину данных, чтобы проверить валидацию
buyer.setBuyerData({ email: "test@test.ru", phone: "+79991234567" });
console.log("6. [Покупатель] Текущие данные:", buyer.getBuyerData());
console.log(
  "7. [Покупатель] Ошибки валидации (должен ругаться на адрес и оплату):",
  buyer.validateData(),
);

// ==========================================
// ТЕСТИРОВАНИЕ СЛОЯ КОММУНИКАЦИИ
// ==========================================

// Инициализируем базовый API с адресом сервера из констант
const baseApi = new Api(API_URL);
// Передаем базовый API в наш специализированный класс
const api = new LarekAPI(baseApi);

// Делаем реальный запрос на сервер
api
  .getProductList()
  .then((res) => {
    // Берем массив товаров из ответа сервера (res.items) и сохраняем в модель
    catalog.setProducts(res.items);

    // Проверяем, что каталог действительно обновился
    console.log(
      "8. [Сервер] Настоящий каталог успешно загружен:",
      catalog.getProducts(),
    );
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога:", err);
  });
