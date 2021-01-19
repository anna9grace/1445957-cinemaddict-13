import {humanizeDuration, humanizeDate} from "../utils/util.js";
import AbstractView from "./abstract.js";

const MAX_DESCRIPTION_LENGTH = 140;

const renderControlsState = (controlsState) => {
  return (controlsState) ? `film-card__controls-item--active` : ``;
};

const createFilmCardTemplate = (film) => {
  const {name, poster, rating, releaseDate, duration, genres, description, commentsId, isInWatchlist, isWatched,
    isFavorite} = film;

  const shortDescription = (description.length > MAX_DESCRIPTION_LENGTH)
    ? description.substr(0, MAX_DESCRIPTION_LENGTH - 2) + `...`
    : description;

  return `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${humanizeDate(releaseDate, `YYYY`)}</span>
      <span class="film-card__duration">${humanizeDuration(duration)}</span>
      <span class="film-card__genre">${genres.join(`, `)}</span>
    </p>
    <img src="${poster}" alt="${name}" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${commentsId.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${renderControlsState(isInWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${renderControlsState(isWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${renderControlsState(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class Film extends AbstractView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickToWatch();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatched();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorite();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    let clickElements = this.getElement()
      .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);

    for (let element of clickElements) {
      element.addEventListener(`click`, this._clickHandler);
    }
  }

  setWatchlistClickHandler(callback) {
    this._callback.clickToWatch = callback;
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.clickWatched = callback;
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }
}
