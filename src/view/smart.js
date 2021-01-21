import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  getScroll() {
    return this.getElement().scrollTop;
  }

  applyScroll(scroll) {
    this.getElement().scrollTo(0, scroll);
  }

  updateElement() {
    let previousElement = this.getElement();
    const parent = previousElement.parentElement;
    const scrollY = this.getScroll();
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, previousElement);
    this.applyScroll(scrollY);

    this.restoreHandlers();
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdate) {
      return;
    }
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
