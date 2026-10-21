# Web-ларёк

Учебный интернет-магазин на **TypeScript** с архитектурой **MVP (Model–View–Presenter)**. Пользователь может просматривать каталог и карточки товаров, управлять корзиной, заполнять формы оплаты и контактов, оформлять заказ через API.

## Технологии и запуск

TypeScript, HTML5, SCSS, Vite, Fetch API, DOM API; взаимодействие компонентов организовано через `EventEmitter`.

```bash
npm ci
```

В корне проекта создайте локальный файл `.env` и укажите адрес API, используемый в задании:

```dotenv
VITE_API_ORIGIN=https://larek.ffapi.ru
```

Файл `.env.example` — образец переменных окружения из стартового проекта. Адреса `API_URL` и `CDN_URL` формируются в `src/utils/constants.ts` на основе `VITE_API_ORIGIN`; запасного адреса в коде нет.

```bash
npm run dev
npx tsc --noEmit
npm run build
```

## Структура проекта

- `index.html` — разметка страницы и HTML-шаблоны.
- `src/main.ts` — Presenter, инициализация и координация компонентов.
- `src/types/index.ts` — общие интерфейсы и типы.
- `src/components/base/` — базовые классы `Component`, `EventEmitter`, `Api`.
- `src/components/models/` — модели `Catalog`, `Basket`, `BuyerData`.
- `src/components/views/` — представления интерфейса.
- `src/components/LarekAPI.ts` — адаптер сервера магазина.
- `src/utils/` — утилиты и константы; `src/scss/` и `src/common.blocks/` — стили.

## Архитектура MVP

**Model** хранит и проверяет данные, изменяет состояние и уведомляет об изменениях через `EventEmitter`; с DOM не работает.

**View** получает подготовленные данные через `render()` и сеттеры, обновляет DOM и сообщает о действиях пользователя. Представления не читают ID товаров из разметки и не принимают бизнес-решений. Готовые HTML-элементы передаются в конструкторы представлений.

**Presenter** находится в `src/main.ts`: создаёт модели и представления, клонирует шаблоны через `cloneTemplate()`, обрабатывает события, подготавливает данные и выполняет запросы через `LarekAPI`.

Основной поток: **действие пользователя → Presenter → Model → событие модели → Presenter → обновление View**. Содержимое корзины и форм обновляется по событиям моделей; при открытии модального окна в него только передаётся готовый элемент. Начальное состояние задаётся через `basket.clear()` и `buyer.clearData()`.

## Типы данных

Общие типы описаны в `src/types/index.ts`:

- `IProduct` — товар (`id`, `title`, `description`, `image`, `category`, `price: number | null`).
- `IBuyer` — покупатель (`payment`, `address`, `email`, `phone`); `TPayment = "online" | "cash"`.
- `TFormErrors` — объект ошибок полей покупателя; `IFormData` — `valid: boolean` и `errors: string[]`.
- `IProductCardData` — общие поля карточек: `title: string`, `price: number | null`.
- `IProductList` — ответ каталога (`total: number`, `items: IProduct[]`).
- `IOrder` — данные покупателя, `total: number` и `items: string[]` (ID товаров).
- `IOrderResult` — результат покупки (`id: string`, `total: number`).
- `IApi` — интерфейс HTTP-клиента с методами `get` и `post`.

Интерфейсы, необходимые только одному представлению, объявлены внутри соответствующих модулей.

## Базовые классы

### `Component<T>`

Базовый класс представлений. **Конструктор:** `constructor(container: HTMLElement)`. **Поле:** `container: HTMLElement`. **Методы:** `render(data?: Partial<T>): HTMLElement` — применяет данные к сеттерам и возвращает контейнер; `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение.

### `EventEmitter`

Брокер событий. **Конструктор:** `constructor()`. **Поле:** `_events: Map<EventName, Set<Subscriber>>` — подписчики. **Методы:** `on<T extends object>(eventName: string | RegExp, callback: (data: T) => void): void`, `off(eventName: string | RegExp, callback: Function): void`, `emit<T extends object>(eventName: string, data?: T): void`; дополнительные методы `onAll(callback)`, `offAll(): void`, `trigger(eventName, context?)`.

### `Api`

Базовый HTTP-клиент. **Конструктор:** `constructor(baseUrl: string, options?: RequestInit)`. **Поля:** `baseUrl: string`, `options: RequestInit`. **Методы:** `get<T extends object>(uri: string): Promise<T>`, `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`, `handleResponse<T>(response: Response): Promise<T>`.

## Модели данных

### `Catalog`

Хранит товары и выбранный товар. **Конструктор:** `constructor(events: IEvents)`. **Поля:** `products: IProduct[]`, `previewProduct: IProduct | null`, `events: IEvents`. **Методы:** `setProducts(items: IProduct[]): void`, `getProducts(): IProduct[]`, `getProductById(id: string): IProduct | undefined`, `setPreview(item: IProduct): void`, `getPreview(): IProduct | null`. **События:** `catalog:changed`, `catalog:preview-changed`.

### `Basket`

Хранит покупки и вычисляет их стоимость. **Конструктор:** `constructor(events: IEvents)`. **Поля:** `items: IProduct[]`, `events: IEvents`. **Методы:** `getItems(): IProduct[]`, `addItem(item: IProduct): void`, `removeItem(id: string): void`, `clear(): void`, `getTotalPrice(): number`, `getTotalCount(): number`, `isInBasket(id: string): boolean`. **Событие:** `basket:changed`.

### `BuyerData`

Хранит и проверяет сведения покупателя. **Конструктор:** `constructor(events: IEvents)`. **Поля:** `payment: TPayment | null`, `address: string`, `email: string`, `phone: string`, `events: IEvents`. **Методы:** `setBuyerData(data: Partial<IBuyer>): void`, `getBuyerData(): IBuyer`, `clearData(): void`, `validateData(): TFormErrors`. **Событие:** `buyer:changed`.

## Слой коммуникации

### `LarekAPI`

Адаптер API магазина, зависящий от интерфейса `IApi`, а не от класса `Api`. **Конструктор:** `constructor(baseApi: IApi)`. **Поле:** `_baseApi: IApi`. **Методы:** `getProductList(): Promise<IProductList>` — получить каталог; `orderProducts(order: IOrder): Promise<IOrderResult>` — отправить заказ.

## Слой представления (View)

Все представления наследуют `render(data?: Partial<T>): HTMLElement` от `Component`. Сеттеры принимают значения указанных типов и обновляют DOM, ничего не возвращая.

### `Gallery`

Отображает карточки каталога. **Конструктор:** `constructor(container: HTMLElement)`. **Поле:** унаследованный `container: HTMLElement`. **Сеттер:** `items(cards: HTMLElement[])` — заменяет содержимое галереи.

### `Header`

Шапка сайта и счётчик корзины. **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`. **Поля:** `counterElement: HTMLElement`, `basketButton: HTMLButtonElement`. **Сеттер:** `counter(value: number)`. **Событие:** `basket:open`.

### `Card<T extends IProductCardData>`

Абстрактный родитель карточек. **Конструктор:** `protected constructor(container: HTMLElement)`. **Поля:** `titleElement: HTMLElement`, `priceElement: HTMLElement`. **Сеттеры:** `title(value: string)`, `price(value: number | null)` — выводят название и цену (при `null` — «Бесценно»).

### `ProductCard<T extends IProductCardData>`

Абстрактная карточка с изображением и категорией, наследуется от `Card<T>`. **Конструктор:** `protected constructor(container: HTMLElement)`. **Поля:** `categoryElement: HTMLElement`, `imageElement: HTMLImageElement`. **Сеттеры:** `category(value: string)`, `image(value: string)`, `imageAlt(value: string)`. В `image` поступает уже готовый URL, полученный через API и переданный Presenter; компонент не читает `alt` из заголовка.

### `CatalogCard`

Карточка каталога. **Конструктор:** `constructor(container: HTMLElement, events: IEvents, productId: string)`. **Поля и сеттеры:** унаследованы от `ProductCard`; **метод:** унаследованный `render(data?: Partial<ICatalogCardData>): HTMLElement`. При нажатии на карточку компонент генерирует событие catalog:select, передавая идентификатор товара { id: productId } через EventEmitter. Обработка события и выбор товара выполняются в Presenter. Компонент не изменяет данные модели напрямую и не извлекает ID из DOM.

### `PreviewCard`

Подробная карточка товара. **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`. **Поля:** `events: IEvents`, `descriptionElement: HTMLElement`, `button: HTMLButtonElement`. **Сеттеры:** `description(value: string)`, `buttonText(value: string)`, `buttonDisabled(value: boolean)`; **метод:** `render(data?: Partial<IPreviewCardData>): HTMLElement` (унаследован). **Событие:** `preview:toggle` без данных; товар определяется по `Catalog.getPreview()`.

### `BasketCard`

Карточка отдельной позиции корзиныю. Наследуется от Card. **Конструктор:** `constructor(container: HTMLElement, events: IEventsm, productId: string)`.
**Поля:** `indexElement: HTMLElement`, `deleteButton: HTMLButtonElement`. **Сеттер:** `index(value: number)`; **метод:** `render(data?: Partial<IBasketCardData>): HTMLElement`. При нажатии на кнопку удаления компонент генерирует событие basket: remove, передавай {id: productId } через EventEmitter. Удаление товара из модели выполняется в Presenter. Компонент не изменяет состояния корзины самостоятельно.

### `BasketView`

Список покупок и итоговая сумма. **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`. **Поля:** `listElement: HTMLUListElement`, `totalElement: HTMLElement`, `checkoutButton: HTMLButtonElement`. **Сеттеры:** `items(value: HTMLElement[])`, `total(value: number)`, `isEmpty(value: boolean)`. **Событие:** `basket:checkout`.

### `Form<T extends IFormData>`

Абстрактный родитель форм. **Конструктор:** `protected constructor(container: HTMLFormElement, events: IEvents, changeEvent: string, submitEvent: string)`. **Поля:** `formElement: HTMLFormElement`, `submitButton: HTMLButtonElement`, `errorElement: HTMLElement`, `inputs: HTMLInputElement[]`. **Сеттеры:** `valid(value: boolean)`, `errors(value: string[])`. При вводе и отправке генерирует события; бизнес-валидация остаётся в модели.

### `OrderForm`

Выбор способа оплаты и адреса. **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`. **Поля:** `onlineButton: HTMLButtonElement`, `cashButton: HTMLButtonElement`, `addressInput: HTMLInputElement`. **Сеттеры:** `address(value: string)`, `payment(value: TPayment | null)`; унаследованы `valid` и `errors`. **События:** `order:change`, `order:submit`.

### `ContactsForm`

Форма контактов. **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`. **Поля:** `emailInput: HTMLInputElement`, `phoneInput: HTMLInputElement`. **Сеттеры:** `email(value: string)`, `phone(value: string)`; унаследованы `valid` и `errors`. **События:** `contacts:change`, `contacts:submit`.

### `Modal`

Управляет модальным окном, не наследуется другими представлениями. **Конструктор:** `constructor(container: HTMLElement)`. **Поля:** `contentElement: HTMLElement`, `closeButton: HTMLButtonElement`, `handleEscape: (event: KeyboardEvent) => void`. **Методы:** `open(content: HTMLElement): void`, `close(): void`. Закрывает себя по крестику, клику на фон и Escape; слушатель клавиатуры устанавливается при открытии и снимается при закрытии.

### `SuccessView`

Экран успешного заказа. **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`. **Поля:** `totalElement: HTMLElement`, `closeButton: HTMLButtonElement`. **Сеттер:** `total(value: number)` — сумма списания. **Событие:** `success:close`.

## События и сценарий заказа

| Событие                            | Действие Presenter                   |
| ---------------------------------- | ------------------------------------ |
| `catalog:changed`                  | Обновить каталог                     |
| `catalog:preview-changed`          | Обновить превью                      |
| `basket:changed`                   | Обновить счётчик, корзину и превью   |
| `buyer:changed`                    | Обновить обе формы                   |
| `preview:toggle`                   | Добавить или удалить выбранный товар |
| `basket:open`                      | Показать подготовленную корзину      |
| `basket:checkout`                  | Открыть форму доставки               |
| `order:change` / `contacts:change` | Сохранить данные в `BuyerData`       |
| `order:submit`                     | Открыть форму контактов              |
| `contacts:submit`                  | Отправить заказ                      |
| `success:close`                    | Закрыть окно подтверждения           |

Карточки каталога и корзины получают обработчики через конструкторы, поэтому отдельные события `card:select` и `basket:remove` не используются.

При оформлении заказа Presenter получает актуальные данные из `BuyerData` и `Basket`, формирует объект `IOrder` и вызывает `LarekAPI.orderProducts()`. Кнопки переходов управляются состоянием валидности форм. Переменная `sending` предотвращает повторные одновременные запросы. **Корзина и данные покупателя очищаются только после успешного ответа сервера**; затем отображается `SuccessView`. При ошибке сервера данные сохраняются, а в форме контактов показывается сообщение об ошибке.
