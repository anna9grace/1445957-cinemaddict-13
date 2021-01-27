import {createElement} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 400;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one`);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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

  show() {
    this.getElement().style.display = ``;
  }

  hide() {
    this.getElement().style.display = `none`;
  }

  shake(callback, element) {
    const animatedElement = element ? element : this.getElement();

    animatedElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      animatedElement.style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
