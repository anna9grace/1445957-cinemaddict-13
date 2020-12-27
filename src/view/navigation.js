import AbstractView from "./abstract.js";

const createNavigationTemplate = () => {
  return `<nav class="main-navigation">
          <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`;
};


export default class Navigation extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._isMenuActivate = false;
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._changeMenuState();
    this._callback.click(this._isMenuActivate);
  }


  setMenuClickHandler(callback) {
    this._callback.click = callback;
    this.getElement()
      .querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, this._menuClickHandler);
  }

  _changeMenuState() {
    const button = this.getElement().querySelector(`.main-navigation__additional`);

    button.classList.toggle(`main-navigation__additional--active`);
    this._isMenuActivate = button.classList.contains(`main-navigation__additional--active`);
  }
}
