import AbstractView from "./abstract.js";

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<a href="#${type}" 
      class="main-navigation__item ${currentFilterType === type ? `main-navigation__item--active` : ``}"
      data-filter-type="${type}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  );
};


export const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersListTemplate = filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join(``);
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersListTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterChangeHandler);
  }
}
