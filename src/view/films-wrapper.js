import {createElement} from "../util.js";

const createFilmsWrapperTemplate = () => {
  return `<div class="films-list__container">
    </div>`;
};

export default class FilmsWrapper {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsWrapperTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
