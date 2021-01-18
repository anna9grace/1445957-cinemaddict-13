import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/popup.js";
import {UserAction, UpdateType, FilterType} from "../utils/constants.js";
import {RenderPosition, render, removeElement, replace, changePageOverflow} from "../utils/render.js";
import dayjs from "dayjs";


export default class Film {
  constructor(filmListContainer, popupContainer, filmChange, previousPopupClose, commentsModel, currentFilter, api) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;
    this._filmChange = filmChange;
    this._previousPopupClose = previousPopupClose;
    this._commentsModel = commentsModel;
    this._currentFilter = currentFilter;
    this._api = api;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handlePopupOpen = this._handlePopupOpen.bind(this);
    this._handlePopupClose = this._handlePopupClose.bind(this);
    this._handleCommentDeletion = this._handleCommentDeletion.bind(this);
    this._handleCommentAddition = this._handleCommentAddition.bind(this);
  }


  init(film) {
    this._film = film;
    const comments = this._commentsModel.getComments(film);
    const previousFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film, comments);

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
      this.closePopup();
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
    const comments = this._commentsModel.getComments();
    this._filmPopupComponent = new FilmPopupView(film, comments);
    changePageOverflow();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._filmPopupComponent.setClickHandler(this._handlePopupClose);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setCommentDeleteHandler(this._handleCommentDeletion);
    this._filmPopupComponent.setCommentAddHandler(this._handleCommentAddition);
    render(this._popupContainer, RenderPosition.AFTEREND, this._filmPopupComponent);
  }


  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.closePopup();
    }
  }

  _handlePopupOpen(film) {
    this._api.getComments(film).then((comments) => {
      this._commentsModel.setComments(comments);
    })
    .then(() => {
      this._renderPopup(film);
    });
    // .catch(() => {
    //   filmsModel.setFilms(UpdateType.INIT, []);
    // });
  }

  _handlePopupClose() {
    this.closePopup();
  }

  _handleWatchlistClick() {
    const isMinorUpdate = (this._currentFilter === FilterType.WATCHLIST);
    this._filmChange(
        UserAction.UPDATE_FILM,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist})
    );
  }

  _handleWatchedClick() {
    const isMinorUpdate = (this._currentFilter === FilterType.HISTORY);
    this._filmChange(
        UserAction.UPDATE_FILM,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {isWatched: !this._film.isWatched,
              watchDate: !this._film.isWatched ? dayjs().toDate() : null}
        )
    );
  }

  _handleFavoriteClick() {
    const isMinorUpdate = (this._currentFilter === FilterType.FAVORITES);
    this._filmChange(
        UserAction.UPDATE_FILM,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        Object.assign({}, this._film, {isFavorite: !this._film.isFavorite})
    );
  }

  _handleCommentDeletion(commentId) {
    this._filmChange(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, {film: this._film}, {comment: commentId})
    );
  }

  _handleCommentAddition(newComment) {
    this._filmChange(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, {film: this._film}, {comment: newComment})
    );
  }
}
