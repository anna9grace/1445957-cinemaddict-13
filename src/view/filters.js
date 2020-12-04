import AbstractView from "./abstract.js";

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

export default class Filters extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
