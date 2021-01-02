import FilmsBlockView from "../view/films-block.js";
import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import LoadingView from "../view/loading.js";
import TopRatedListView from "../view/top-rated-films.js";
import TopCommentedListView from "../view/top-commented-films.js";
import LoadMoreButtonView from "../view/show-more.js";

import FilmPresenter from "./film.js";
import {RenderPosition, render, removeElement, getContainer} from "../utils/render.js";
import {getTopCommentedFilms, getTopRatedFilms, sortByRating, sortByDate} from "../utils/films.js";
import {SortType, UpdateType, UserAction} from "../utils/constants.js";
import {filter} from "../utils/filter.js";

const FILMS_COUNT_PER_STEP = 5;
const TOP_FILMS_COUNT = 2;


export default class moviesBoard {
  constructor(filmsContainer, popupContainer, filmsModel, filterModel, commentsModel, api) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmPresenters = {};
    this._filmRatedPresenters = {};
    this._filmCommentedPresenters = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();
    this._topRatedComponent = new TopRatedListView();
    this._topCommentedComponent = new TopCommentedListView();
    this._loadMoreComponent = null;
    this._sortComponent = null;

    this._handleLoadMoreClick = this._handleLoadMoreClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }


  init() {
    render(this._filmsContainer, RenderPosition.BEFOREEND, this._filmsBlockComponent);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._renderFilmsBoard();
  }

  hideFilmsBoard() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
    this._sortComponent.hide();
    this._filmsBlockComponent.hide();
  }

  showFilmsBoard() {
    this._sortComponent.show();
    this._filmsBlockComponent.show();
    this._renderFilmsBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return sortByDate(filteredFilms);
      case SortType.BY_RATING:
        return sortByRating(filteredFilms);
    }
    return filteredFilms;
  }


  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilm(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        removeElement(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }


  _renderFilm(film, filmsList, presenters) {
    const currentFilter = this._filterModel.getFilter();
    const filmPresenter = new FilmPresenter(filmsList, this._popupContainer, this._handleViewAction, this._handlePopupChange, this._commentsModel, currentFilter, this._api);
    filmPresenter.init(film);
    presenters[film.id] = filmPresenter;
  }


  _updateFilm(film) {
    if (this._filmPresenters[film.id]) {
      this._filmPresenters[film.id].init(film);
    }
    if (this._filmRatedPresenters[film.id]) {
      this._filmRatedPresenters[film.id].init(film);
    }
    if (this._filmCommentedPresenters[film.id]) {
      this._filmCommentedPresenters[film.id].init(film);
    }
  }


  _renderFilms(films) {
    const container = getContainer(this._filmsListComponent);
    films.forEach((film) => this._renderFilm(film, container, this._filmPresenters));
  }


  _renderFilmsList() {
    const films = this._getFilms();
    const filmCount = films.length;

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmsCount)));
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._filmsListComponent);

    if (filmCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }


  _renderNoFilms() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._noFilmsComponent);
  }


  _renderLoading() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._loadingComponent);
  }


  _renderTopList(topFilms, topList, presenters) {
    const container = getContainer(topList);
    if (topFilms.length > 0) {
      for (let i = 0; i < Math.min(topFilms.length, TOP_FILMS_COUNT); i++) {
        this._renderFilm(topFilms[i], container, presenters);
      }
      render(this._filmsBlockComponent, RenderPosition.BEFOREEND, topList);
    }
  }


  _renderTopRatedList(films) {
    this._renderTopList(getTopRatedFilms(films), this._topRatedComponent, this._filmRatedPresenters);
  }

  _renderTopCommentedList(films) {
    this._renderTopList(getTopCommentedFilms(films), this._topCommentedComponent, this._filmCommentedPresenters);
  }


  _handleLoadMoreClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (filmCount <= this._renderedFilmsCount) {
      removeElement(this._loadMoreComponent);
    }
  }


  _renderLoadMoreButton() {
    if (this._loadMoreComponent !== null) {
      this._loadMoreComponent = null;
    }
    this._loadMoreComponent = new LoadMoreButtonView();
    this._loadMoreComponent.setClickHandler(this._handleLoadMoreClick);
    render(this._filmsListComponent, RenderPosition.BEFOREEND, this._loadMoreComponent);
  }


  _clearFilmsList(presenters) {
    Object
      .values(presenters)
      .forEach((presenter) => presenter.destroy());
    presenters = {};
  }


  _handleFilmsListsClear() {
    this._clearFilmsList(this._filmPresenters);
    this._clearFilmsList(this._filmRatedPresenters);
    this._clearFilmsList(this._filmCommentedPresenters);
  }


  _handlePopupChange() {
    Object
      .values(this._filmPresenters)
      .forEach((presenter) => presenter.closePopup());
    Object
      .values(this._filmRatedPresenters)
      .forEach((presenter) => presenter.closePopup());
    Object
      .values(this._filmCommentedPresenters)
      .forEach((presenter) => presenter.closePopup());
  }


  _handleSortChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard({resetRenderedFilmCount: true});
    this._renderFilmsBoard();
  }


  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);

    render(this._filmsBlockComponent, RenderPosition.BEFOREBEGIN, this._sortComponent);
  }


  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;
    this._handleFilmsListsClear();

    removeElement(this._loadMoreComponent);
    removeElement(this._sortComponent);
    removeElement(this._noFilmsComponent);
    removeElement(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }


  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderFilmsList();
    this._renderTopRatedList(films);
    this._renderTopCommentedList(films);
  }
}
