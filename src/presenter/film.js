import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/film-popup.js";
import {UserAction, UpdateType, FilterType} from "../utils/constants.js";
import {isOnline} from "../utils/util.js";
import {RenderPosition, render, removeElement, replace, changePageOverflow} from "../utils/render.js";
import {toast} from "../utils/toast.js";
import dayjs from "dayjs";

export const State = {
  SENDING: `SENDING`,
  DELETING: `DELETING`,
  DELETE_ABORTING: `DELETE_ABORTING`,
  SEND_ABORTING: `SEND_ABORTING`,
};


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
    this.filmPopupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this.handlePopupOpen = this.handlePopupOpen.bind(this);
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
      this.handlePopupOpen(film);
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
    if (this.filmPopupComponent !== null) {
      this.closePopup();
    }
  }

  setViewState(state) {
    const commentId = this.filmPopupComponent.currentCommentId;
    const resetFormState = () => {
      this.filmPopupComponent.currentCommentId = null;
      this.filmPopupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SENDING:
        this.filmPopupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.filmPopupComponent.updateData({
          isDeleting: true
        });
        break;
      case State.SEND_ABORTING:
        this.filmPopupComponent.shake(resetFormState);
        break;
      case State.DELETE_ABORTING:
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
        this.filmPopupComponent.shake(resetFormState, commentElement);
        break;
    }
  }

  closePopup() {
    if (this.filmPopupComponent !== null) {
      removeElement(this.filmPopupComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this.filmPopupComponent = null;
      changePageOverflow();
    }
  }

  _renderPopup(film, isPositionSave) {
    const scroll = isPositionSave && this.filmPopupComponent ? this.filmPopupComponent.getScroll() : 0;

    this._previousPopupClose();
    const comments = this._commentsModel.getComments();
    this.filmPopupComponent = new FilmPopupView(film, comments);
    changePageOverflow();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this.filmPopupComponent.setClickHandler(this._handlePopupClose);
    this.filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.filmPopupComponent.setCommentDeleteHandler(this._handleCommentDeletion);
    this.filmPopupComponent.setCommentAddHandler(this._handleCommentAddition);
    render(this._popupContainer, RenderPosition.AFTEREND, this.filmPopupComponent);
    this.filmPopupComponent.applyScroll(scroll);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.closePopup();
    }
  }

  handlePopupOpen(film, isPositionSave) {
    if (isPositionSave && this.filmPopupComponent === null) {
      return;
    }
    this._api.getComments(film).then((comments) => {
      this._commentsModel.setComments(comments);
    })
    .then(() => {
      this._renderPopup(film, isPositionSave);
    })
    .catch(() => {
      this._commentsModel.setComments(null);
      this._renderPopup(film, isPositionSave);
    });
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
              watchDate: !this._film.isWatched ? dayjs().toDate() : dayjs(0).toDate()}
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
    if (!isOnline()) {
      toast(`You can't delete comments offline`);
      return;
    }
    this._filmChange(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, {film: this._film}, {comment: commentId})
    );
  }

  _handleCommentAddition(newComment) {
    if (!isOnline()) {
      toast(`You can't add comments offline`);
      return;
    }
    this._filmChange(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, {film: this._film}, {comment: newComment})
    );
  }
}
