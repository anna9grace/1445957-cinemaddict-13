import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }


  updateElement() {
    let previousElement = this.getElement();
    const parent = previousElement.parentElement;
    const scrollY = previousElement.scrollTop;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, previousElement);
    newElement.scrollTo(0, scrollY);

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
