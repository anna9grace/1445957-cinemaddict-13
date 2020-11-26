import {humanizeFilmDuration, humanizeDate, createElement} from "../util.js";

const MAX_DESCRIPTION_LENGTH = 140;

const renderControlsState = (controlsState) => {
  return (controlsState) ? `film-card__controls-item--active` : ``;
};


const createFilmCardTemplate = (film) => {
  const {name, poster, rating, releaseDate, duration, genres, description, comments, isInWatchlist, isWatched,
    isFavorite} = film;

  const commentsCount = (comments === null) ? 0 : comments.length;
  const shortDescription = (description.length > MAX_DESCRIPTION_LENGTH)
    ? description.substr(0, MAX_DESCRIPTION_LENGTH - 2) + `...`
    : description;

  return `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${humanizeDate(releaseDate, `YYYY`)}</span>
      <span class="film-card__duration">${humanizeFilmDuration(duration)}</span>
      <span class="film-card__genre">${genres.join(`, `)}</span>
    </p>
    <img src="${poster}" alt="${name}" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${commentsCount} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${renderControlsState(isInWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${renderControlsState(isWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${renderControlsState(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};


export default class Film {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
