import AbstractView from "./abstract.js";
import {MenuItem} from "../utils/constants.js";

const createNavigationTemplate = () => {
  return `<nav class="main-navigation">
          <a href="#stats" class="main-navigation__additional" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
      </nav>`;
};


export default class Navigation extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _menuClickHandler(evt) {
    const target = evt.target;
    if (target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.menuClick(target.dataset.menuItem);
    this._changeMenuState(target);
  }

  _changeMenuState(target) {
    const activeItemElement = this.getElement().querySelector(`.main-navigation__item--active`);
    const activeAdditionalItemElement = this.getElement().querySelector(`.main-navigation__additional--active`);

    if (target.dataset.menuItem === MenuItem.STATISTICS && activeItemElement) {
      activeItemElement.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__additional--active`);
      return;
    }
    if (activeAdditionalItemElement) {
      activeAdditionalItemElement.classList.remove(`main-navigation__additional--active`);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
