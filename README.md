# Web-ларёк

Учебный интернет-магазин на TypeScript, реализованный с использованием архитектуры **MVP (Model–View–Presenter)**.

Приложение позволяет просматривать каталог, добавлять и удалять товары из корзины, выбирать способ оплаты и оформлять заказ через API.

## Технологии

TypeScript, HTML5, SCSS, Vite, Fetch API, DOM API. Для взаимодействия компонентов используется `EventEmitter`.

## Установка и запуск

```bash
npm ci
npm run dev
```

Перед запуском необходимо создать файл `.env` по образцу `.env.example`:

```dotenv
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Проверка TypeScript и сборка:

```bash
npx tsc --noEmit
npm run build
```

## Структура проекта

- `src/main.ts` — презентер приложения.
- `src/types/` — общие интерфейсы и типы.
- `src/components/base/` — базовые классы стартового проекта.
- `src/components/models/` — модели данных.
- `src/components/views/` — компоненты интерфейса.
- `src/components/LarekAPI.ts` — взаимодействие с сервером.
- `src/utils/` — константы и утилиты.
- `src/scss/`, `src/common.blocks/` — стили.
- `index.html` — разметка и шаблоны компонентов.

## Архитектура MVP

**Model** — хранит и изменяет данные, выполняет валидацию и отправляет события об изменениях. Модели не обращаются к DOM.

**View** — отображает полученные данные через сеттеры и `render()`, реагирует на действия пользователя. Представления не принимают бизнес-решений.

**Presenter** — реализован в `main.ts`. Создаёт модели и представления, связывает их через события, подготавливает данные для отображения и координирует API-запросы.

Основной поток данных:

1. Пользователь выполняет действие в View.
2. Presenter обрабатывает действие и вызывает метод Model.
3. Model изменяет состояние и отправляет событие.
4. Presenter получает актуальные данные и обновляет View.

Представления перерисовываются в обработчиках событий моделей. Открытие модального окна только показывает уже подготовленное содержимое.

При запуске корзина и данные покупателя инициализируются методами `basket.clear()` и `buyer.clearData()`.

## Типы данных

Общие типы расположены в `src/types/index.ts`.

| Тип                | Назначение                                                        |
| ------------------ | ----------------------------------------------------------------- |
| `IProduct`         | Товар: `id`, `title`, `description`, `image`, `category`, `price` |
| `IProductCardData` | Общие поля карточки: `title: string`, `price: number \| null`     |
| `IBuyer`           | Данные покупателя: `payment`, `address`, `email`, `phone`         |
| `TPayment`         | Способ оплаты: `"online" \| "cash"`                               |
| `TFormErrors`      | Ошибки валидации полей покупателя                                 |
| `IFormData`        | Состояние формы: `valid: boolean`, `errors: string[]`             |
| `IProductList`     | Ответ API: количество и массив товаров                            |
| `IOrder`           | Данные покупателя, сумма и массив ID товаров                      |
| `IOrderResult`     | ID заказа и итоговая сумма                                        |
| `IApi`             | Интерфейс HTTP-клиента                                            |

## Базовые классы стартового проекта

### Component&lt;T&gt;

Базовый класс всех представлений.

- **Конструктор:** `constructor(container: HTMLElement)`.
- **Поле:** `container: HTMLElement` — корневой элемент.
- **Методы:** `render(data?: Partial<T>): HTMLElement` — обновляет компонент; `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение.

### EventEmitter

Брокер событий, обеспечивающий взаимодействие компонентов.

- **Конструктор:** `constructor()`.
- **Поле:** `_events: Map<EventName, Set<Subscriber>>` — подписчики событий.
- **Методы:** `on(eventName, callback): void` — подписка; `off(eventName, callback): void` — удаление подписки; `emit(eventName: string, data?: object): void` — отправка события; `onAll(callback): void`, `offAll(): void`, `trigger(eventName, context?)` — дополнительные средства управления событиями.

### Api

Базовый HTTP-клиент для запросов к серверу.

- **Конструктор:** `constructor(baseUrl: string, options?: RequestInit)`.
- **Поля:** `baseUrl: string`, `options: RequestInit`.
- **Методы:** `get<T extends object>(uri: string): Promise<T>`; `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`; `handleResponse<T>(response: Response): Promise<T>`.

## Модели данных

### Catalog

Хранит каталог и выбранный для просмотра товар.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `products: IProduct[]`, `previewProduct: IProduct | null`, `events: IEvents`.
- **Методы:** `setProducts(items: IProduct[]): void`, `getProducts(): IProduct[]`, `getProductById(id: string): IProduct | undefined`, `setPreview(item: IProduct): void`, `getPreview(): IProduct | null`.
- **События:** `catalog:changed`, `catalog:preview-changed`.

### Basket

Хранит товары корзины и рассчитывает стоимость.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `items: IProduct[]`, `events: IEvents`.
- **Методы:** `getItems(): IProduct[]`, `addItem(item: IProduct): void`, `removeItem(id: string): void`, `clear(): void`, `getTotalPrice(): number`, `getTotalCount(): number`, `isInBasket(id: string): boolean`.
- **Событие:** `basket:changed`.

### BuyerData

Хранит и проверяет данные покупателя.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `payment: TPayment | null`, `address: string`, `email: string`, `phone: string`, `events: IEvents`.
- **Методы:** `setBuyerData(data: Partial<IBuyer>): void`, `getBuyerData(): IBuyer`, `clearData(): void`, `validateData(): TFormErrors`.
- **Событие:** `buyer:changed`.

## Работа с API

### LarekAPI

Класс коммуникации с сервером Web-ларька.

- **Конструктор:** `constructor(baseApi: IApi)`.
- **Поле:** `_baseApi: IApi` — HTTP-клиент.
- **Методы:** `getProductList(): Promise<IProductList>` — получение каталога; `orderProducts(order: IOrder): Promise<IOrderResult>` — отправка заказа.

Класс зависит от интерфейса `IApi`, а не от конкретной реализации `Api`.

## Классы представления

Все представления наследуют метод `render(data?: Partial<T>): HTMLElement` от `Component`. Сеттеры получают типизированное значение и обновляют DOM, не возвращая результата.

### Gallery

Отображает карточки каталога.

- **Конструктор:** `constructor(container: HTMLElement)`.
- **Поле:** унаследованный `container: HTMLElement`.
- **Сеттер:** `items(value: HTMLElement[])` — заменяет карточки галереи.

### Header

Шапка сайта со счётчиком корзины.

- **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`.
- **Поля:** `counterElement: HTMLElement`, `basketButton: HTMLButtonElement`.
- **Сеттер:** `counter(value: number)` — обновляет счётчик.
- **Событие:** `basket:open`.

### Card&lt;T&gt;

Абстрактный базовый класс карточек товара.

- **Конструктор:** `constructor(container: HTMLElement)` — защищённый.
- **Поля:** `titleElement: HTMLElement`, `priceElement: HTMLElement`.
- **Сеттеры:** `title(value: string)` — название; `price(value: number | null)` — цена.

Общий тип `T` ограничен интерфейсом `IProductCardData`. ID товара в HTML не сохраняется.

### ProductCard&lt;T&gt;

Абстрактная карточка с категорией и изображением. Наследуется от `Card<T>`.

- **Конструктор:** `constructor(container: HTMLElement)` — защищённый.
- **Поля:** `categoryElement: HTMLElement`, `imageElement: HTMLImageElement`.
- **Сеттеры:** `category(value: string)`, `image(value: string)`, `imageAlt(value: string)`.

Адрес изображения формируется с использованием `CDN_URL`; описание `alt` передаётся извне.

### CatalogCard

Карточка товара в каталоге. Наследуется от `ProductCard`.

- **Конструктор:** `constructor(onClick: () => void)`.
- **Поля:** унаследованные поля `ProductCard`.
- **Методы:** унаследованные `render(data?: Partial<ICatalogCardData>): HTMLElement` и сеттеры.

Обработчик выбора товара передаётся через конструктор. ID из DOM не считывается.

### PreviewCard

Подробная карточка выбранного товара.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `events: IEvents`, `descriptionElement: HTMLElement`, `button: HTMLButtonElement`.
- **Сеттеры:** `description(value: string)`, `buttonText(value: string)`, `buttonDisabled(value: boolean)`.
- **Метод:** унаследованный `render(data?: Partial<IPreviewCardData>): HTMLElement`.
- **Событие:** `preview:toggle` без дополнительных данных.

Presenter передаёт текст кнопки и её доступность.

### BasketCard

Отображает отдельную позицию корзины.

- **Конструктор:** `constructor(onDelete: () => void)`.
- **Поля:** `indexElement: HTMLElement`, `deleteButton: HTMLButtonElement`.
- **Сеттер:** `index(value: number)` — порядковый номер.
- **Метод:** унаследованный `render(data?: Partial<IBasketCardData>): HTMLElement`.

Удаление выполняется через переданный обработчик.

### BasketView

Отображает содержимое и общую стоимость корзины.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `listElement: HTMLUListElement`, `totalElement: HTMLElement`, `checkoutButton: HTMLButtonElement`.
- **Сеттеры:** `items(value: HTMLElement[])`, `total(value: number)`, `isEmpty(value: boolean)`.
- **Событие:** `basket:checkout`.

### Form&lt;T&gt;

Абстрактный базовый класс форм.

- **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents, changeEvent: string, submitEvent: string)` — защищённый.
- **Поля:** `formElement: HTMLFormElement`, `submitButton: HTMLButtonElement`, `errorElement: HTMLElement`, `inputs: HTMLInputElement[]`.
- **Сеттеры:** `valid(value: boolean)`, `errors(value: string[])`.

Отправляет события ввода и отправки формы. Проверка допустимости перехода выполняется Presenter на основании модели.

### OrderForm

Форма выбора оплаты и адреса.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `onlineButton: HTMLButtonElement`, `cashButton: HTMLButtonElement`, `addressInput: HTMLInputElement`.
- **Сеттеры:** `address(value: string)`, `payment(value: TPayment | null)`.
- **События:** `order:change`, `order:submit`.

Сеттер `payment` обновляет CSS-класс `button_alt-active` после изменения данных модели.

### ContactsForm

Форма контактных данных покупателя.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `emailInput: HTMLInputElement`, `phoneInput: HTMLInputElement`.
- **Сеттеры:** `email(value: string)`, `phone(value: string)`.
- **События:** `contacts:change`, `contacts:submit`.

### Modal

Управляет содержимым и закрытием модального окна.

- **Конструктор:** `constructor(container: HTMLElement)`.
- **Поля:** `contentElement: HTMLElement`, `closeButton: HTMLButtonElement`, `handleEscape: (event: KeyboardEvent) => void`.
- **Методы:** `open(content: HTMLElement): void`, `close(): void`.

Модальное окно самостоятельно закрывается по крестику, фону и Escape. Обработчик клавиатуры подключается при открытии и снимается при закрытии. Класс не имеет дочерних классов.

### SuccessView

Экран подтверждения успешного заказа.

- **Конструктор:** `constructor(events: IEvents)`.
- **Поля:** `totalElement: HTMLElement`, `closeButton: HTMLButtonElement`.
- **Сеттер:** `total(value: number)` — сумма заказа.
- **Событие:** `success:close`.

## События и работа Presenter

| Событие                   | Действие                                     |
| ------------------------- | -------------------------------------------- |
| `catalog:changed`         | Обновление каталога                          |
| `catalog:preview-changed` | Обновление превью                            |
| `basket:changed`          | Обновление корзины, счётчика и кнопки превью |
| `buyer:changed`           | Обновление обеих форм                        |
| `preview:toggle`          | Добавление или удаление выбранного товара    |
| `basket:open`             | Открытие подготовленной корзины              |
| `basket:checkout`         | Открытие формы заказа                        |
| `order:change`            | Сохранение способа оплаты или адреса         |
| `order:submit`            | Проверка данных и переход к контактам        |
| `contacts:change`         | Сохранение телефона или email                |
| `contacts:submit`         | Проверка и отправка заказа                   |
| `success:close`           | Закрытие окна подтверждения                  |

`CatalogCard` и `BasketCard` получают обработчики с данными конкретного товара через конструктор, поэтому дополнительные события `card:select` и `basket:remove` не требуются.

### Оформление заказа

После заполнения форм Presenter проверяет данные через `BuyerData.validateData()`, получает товары из `Basket` и формирует `IOrder`.

Заказ отправляется методом `LarekAPI.orderProducts()`. Повторная отправка блокируется переменной `sending`.

**Только после успешного ответа сервера** вызываются `basket.clear()` и `buyer.clearData()`, затем отображается `SuccessView`.

При ошибке API данные покупателя и содержимое корзины сохраняются, а пользователю показывается сообщение об ошибке.
