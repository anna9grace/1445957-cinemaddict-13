import {getRandomInteger, createElement} from "../util.js";

const createStatisticsTemplate = () => {
  return `<p>${getRandomInteger(10000, 1000000)} movies inside</p>`;
};

export default class FooterStats {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
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
