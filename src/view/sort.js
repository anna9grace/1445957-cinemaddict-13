import AbstractView from "./abstract.js";
import {SortType} from "../utils/constants.js";

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.BY_DATE ? `sort__button--active` : ``}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.BY_RATING ? `sort__button--active` : ``}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`;
};


export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.sortChange(evt.target.dataset.sortType);
  }

  setSortChangeHandler(callback) {
    this._callback.sortChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
