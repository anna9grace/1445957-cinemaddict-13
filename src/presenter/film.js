import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/popup.js";
import {RenderPosition, render, removeElement, replace, changePageOverflow} from "../utils/render.js";


export default class Film {
  constructor(filmListContainer, popupContainer, filmChange, previousPopupClose) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;
    this._filmChange = filmChange;
    this._previousPopupClose = previousPopupClose;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupClose = this._handlePopupClose.bind(this);
  }


  init(film) {
    this._film = film;

    const previousFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setClickHandler(() => {
      this._handlePopupOpen(film);
    });
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (previousFilmComponent === null) {
      render(this._filmListContainer, RenderPosition.BEFOREEND, this._filmComponent);
      return;
    }
    replace(this._filmComponent, previousFilmComponent);
    removeElement(previousFilmComponent);
  }

  destroy() {
    removeElement(this._filmComponent);
    if (this._filmPopupComponent !== null) {
      removeElement(this._filmPopupComponent);
    }
  }

  closePopup() {
    if (this._filmPopupComponent !== null) {
      removeElement(this._filmPopupComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._filmPopupComponent = null;
      changePageOverflow();
    }
  }

  _renderPopup(film) {
    this._previousPopupClose();
    this._filmPopupComponent = new FilmPopupView(film);
    changePageOverflow();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._filmPopupComponent.setClickHandler(this._handlePopupClose);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    render(this._popupContainer, RenderPosition.AFTEREND, this._filmPopupComponent);
  }


  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.closePopup();
    }
  }

  _handlePopupOpen(film) {
    this._renderPopup(film);
  }

  _handlePopupClose() {
    this.closePopup();
  }

  _handleWatchlistClick() {
    this._filmChange(Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
  }

  _handleWatchedClick() {
    this._filmChange(Object.assign({}, this._film, {isWatched: !this._film.isWatched}));
  }

  _handleFavoriteClick() {
    this._filmChange(Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
  }
}
