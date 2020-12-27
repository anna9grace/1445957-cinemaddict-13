import FilterView from "../view/filters.js";
import UserProfileView from "../view/user-profile.js";
import {RenderPosition, render, removeElement, replace} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType} from "../utils/constants.js";

export default class Filter {
  constructor(filterContainer, profileContainer, filmsModel, filterModel) {
    this._filterContainer = filterContainer;
    this._profileContainer = profileContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._currentFilter = null;
    this._filterComponent = null;
    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);

    this._renderProfileStatus();

    if (prevFilterComponent === null) {
      render(this._filterContainer, RenderPosition.BEFOREEND, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    removeElement(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }


  _renderProfileStatus() {
    const prevProfileComponent = this._profileComponent;
    const watchedFilms = filter[FilterType.HISTORY](this._filmsModel.getFilms());
    this._profileComponent = new UserProfileView(watchedFilms);

    if (prevProfileComponent === null) {
      render(this._profileContainer, RenderPosition.BEFOREEND, this._profileComponent);
      return;
    }
    replace(this._profileComponent, prevProfileComponent);
    removeElement(prevProfileComponent);
  }


  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](films).length
      },
    ];
  }
}
