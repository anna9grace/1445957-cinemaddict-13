import FilmsBlockView from "../view/films-block.js";
import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedListView from "../view/top-rated-films.js";
import TopCommentedListView from "../view/top-commented-films.js";
import LoadMoreButtonView from "../view/show-more.js";

import FilmPresenter from "./film.js";
import {RenderPosition, render, removeElement, getContainer} from "../utils/render.js";
import {getTopCommentedFilms, getTopRatedFilms} from "../utils/films.js";
import {updateItem} from "../utils/util.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;


export default class moviesBoard {
  constructor(filmsContainer, popupContainer) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmsCount = FILMS_COUNT;
    this._filmPresenters = {};
    this._filmRatedPresenters = {};
    this._filmCommentedPresenters = {};

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadMoreComponent = new LoadMoreButtonView();
    this._topRatedComponent = new TopRatedListView();
    this._topCommentedComponent = new TopCommentedListView();
    this._sortComponent = new SortView();

    this._handleLoadMoreClick = this._handleLoadMoreClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
  }


  init(filmsCollection) {
    this._filmsCollection = filmsCollection.slice();

    render(this._filmsContainer, RenderPosition.BEFOREEND, this._filmsBlockComponent);
    this._renderFilmsBlock(filmsCollection);
  }


  _renderSort() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREBEGIN, this._sortComponent);
  }


  _handleFilmChange(updatedFilm) {
    this._filmsCollection = updateItem(this._filmsCollection, updatedFilm);
    if (this._filmPresenters[updatedFilm.id]) {
      this._filmPresenters[updatedFilm.id].init(updatedFilm);
    }
    if (this._filmRatedPresenters[updatedFilm.id]) {
      this._filmRatedPresenters[updatedFilm.id].init(updatedFilm);
    }
    if (this._filmCommentedPresenters[updatedFilm.id]) {
      this._filmCommentedPresenters[updatedFilm.id].init(updatedFilm);
    }
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


  _renderFilm(film, filmsList, presenters) {
    const filmPresenter = new FilmPresenter(filmsList, this._popupContainer, this._handleFilmChange, this._handlePopupChange);
    filmPresenter.init(film);
    presenters[film.id] = filmPresenter;
  }


  _renderFilms(from, to) {
    const container = getContainer(this._filmsListComponent);
    this._filmsCollection
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, container, this._filmPresenters));
  }


  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._filmsCollection.length, this._renderedFilmsCount));
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._filmsListComponent);

    if (this._filmsCollection.length > FILMS_COUNT) {
      this._renderLoadMoreButton();
    }
  }


  _renderNoFilms() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._noFilmsComponent);
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


  _renderTopLists() {
    this._renderTopList(getTopRatedFilms(this._filmsCollection), this._topRatedComponent, this._filmRatedPresenters);
    this._renderTopList(getTopCommentedFilms(this._filmsCollection), this._topCommentedComponent, this._filmCommentedPresenters);
  }


  _handleLoadMoreClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT,
        this._listContainer);
    this._renderedFilmsCount += FILMS_COUNT;

    if (this._filmsCollection.length <= this._renderedFilmsCount) {
      removeElement(this._loadMoreComponent);
    }
  }


  _renderLoadMoreButton() {
    render(this._filmsListComponent, RenderPosition.BEFOREEND, this._loadMoreComponent);
    this._loadMoreComponent.setClickHandler(this._handleLoadMoreClick);
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
    this._renderedFilmsCount = FILMS_COUNT;
    removeElement(this._loadMoreComponent);
  }


  _renderFilmsBlock(films) {
    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderFilmsList();
    this._renderTopLists();
  }

}
