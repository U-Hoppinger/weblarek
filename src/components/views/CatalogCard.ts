import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

export class CatalogCard extends ProductCard {
  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>("#card-catalog"), events);
    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.container.dataset.id ?? "" });
    });
  }
}
