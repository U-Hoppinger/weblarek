import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { BuyerData } from "./components/models/BuyerData";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { LarekAPI } from "./components/LarekAPI";
import { API_URL } from "./utils/constants";
import { ensureElement } from "./utils/utils";
import { IBuyer, IProduct, IOrder, TPayment, TFormErrors } from "./types";
import { Gallery } from "./components/views/Gallery";
import { Header } from "./components/views/Header";
import { Modal } from "./components/views/Modal";
import { CatalogCard } from "./components/views/CatalogCard";
import { PreviewCard } from "./components/views/PreviewCard";
import { BasketCard } from "./components/views/BasketCard";
import { BasketView } from "./components/views/BasketView";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { SuccessView } from "./components/views/SuccessView";

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new BuyerData(events);

const api = new LarekAPI(new Api(API_URL));

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));

const previewCard = new PreviewCard(events);
const basketView = new BasketView(events);
const orderForm = new OrderForm(events);
const contactsForm = new ContactsForm(events);
const successView = new SuccessView(events);

function renderPreview(): void {
  const product = catalog.getPreview();

  if (!product) return;

  const unavailable = product.price === null;
  const inBasket = basket.isInBasket(product.id);

  const buttonText = unavailable
    ? "Недоступно"
    : inBasket
      ? "Удалить из корзины"
      : "Купить";

  previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    imageAlt: product.title,
    description: product.description,
    buttonText,
    buttonDisabled: unavailable,
  });
}

function renderBasket(): void {
  const cards = basket.getItems().map((item, index) => {
    const card = new BasketCard(() => {
      basket.removeItem(item.id);
    });

    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: cards,
    total: basket.getTotalPrice(),
    isEmpty: basket.getTotalCount() === 0,
  });
}

function renderOrder(): void {
  const data = buyer.getBuyerData();
  const errors = buyer.validateData();

  orderForm.render({
    payment: data.payment,
    address: data.address,
    errors: [errors.payment, errors.address].filter((error): error is string =>
      Boolean(error),
    ),
    valid: !errors.payment && !errors.address,
  });
}

function renderContacts(): void {
  const data = buyer.getBuyerData();
  const errors = buyer.validateData();

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    errors: [errors.email, errors.phone].filter((error): error is string =>
      Boolean(error),
    ),
    valid: !errors.email && !errors.phone,
  });
}

events.on("catalog:changed", () => {
  const cards = catalog.getProducts().map((product) => {
    const card = new CatalogCard(() => {
      catalog.setPreview(product);
      modal.open(previewCard.render());
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      imageAlt: product.title,
    });
  });

  gallery.render({ items: cards });
});

events.on("catalog:preview-changed", () => {
  renderPreview();
});

events.on("basket:changed", () => {
  header.render({ counter: basket.getTotalCount() });
  renderBasket();
  renderPreview();
});

events.on("buyer:changed", () => {
  renderOrder();
  renderContacts();
});

events.on("preview:toggle", () => {
  const product = catalog.getPreview();

  if (!product || product.price === null) return;

  if (basket.isInBasket(product.id)) {
    basket.removeItem(product.id);
  } else {
    basket.addItem(product);
  }

  modal.close();
});

events.on("basket:open", () => {
  modal.open(basketView.render());
});

events.on("basket:checkout", () => {
  if (basket.getTotalCount() === 0) return;

  modal.open(orderForm.render());
});

events.on("success:close", () => {
  modal.close();
});

events.on<{ field: keyof IBuyer; value: string }>(
  "order:change",
  ({ field, value }) => {
    if (field === "payment") {
      buyer.setBuyerData({ payment: value as TPayment });
    }

    if (field === "address") {
      buyer.setBuyerData({ address: value });
    }
  },
);

events.on("order:submit", () => {
  const errors = buyer.validateData();

  if (errors.payment || errors.address) return;

  modal.open(contactsForm.render());
});

events.on<{ field: keyof IBuyer; value: string }>(
  "contacts:change",
  ({ field, value }) => {
    if (field === "email") {
      buyer.setBuyerData({ email: value });
    }

    if (field === "phone") {
      buyer.setBuyerData({ phone: value });
    }
  },
);

let sending = false;

events.on("contacts:submit", async () => {
  if (sending) return;

  const errors: TFormErrors = buyer.validateData();

  if (Object.keys(errors).length) return;

  const items: IProduct[] = basket.getItems();

  if (!items.length) return;

  const order: IOrder = {
    ...buyer.getBuyerData(),
    total: basket.getTotalPrice(),
    items: items.map((item) => item.id),
  };

  sending = true;

  contactsForm.render({
    valid: false,
    errors: [],
  });

  try {
    const result = await api.orderProducts(order);

    basket.clear();
    buyer.clearData();

    modal.open(
      successView.render({
        total: result.total,
      }),
    );
  } catch (error) {
    renderContacts();

    contactsForm.render({
      errors: [`Не удалось оформить заказ: ${String(error)}`],
    });
  } finally {
    sending = false;
  }
});

basket.clear();
buyer.clearData();

api
  .getProductList()
  .then((response) => {
    catalog.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Не удалось загрузить каталог:", error);
    gallery.render({ items: [] });
  });
