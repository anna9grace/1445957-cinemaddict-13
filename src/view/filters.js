import {createElement} from "../util.js";

const createFilterTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span            class="main-navigation__item-count">${count}</span></a>`;
};

const createFiltersTemplate = (filters) => {
  const filtersListTemplate = filters.map((filter) => createFilterTemplate(filter)).join(``);
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filtersListTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
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
