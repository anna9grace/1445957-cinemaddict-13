import SmartView from "./smart.js";
import {humanizeDuration, humanizeDate} from "../utils/util.js";
import he from "he";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


const renderControlsState = (controlsState) => {
  return (controlsState) ? `checked` : ``;
};

const createGenresListTemplate = (genres) => {
  const title = genres.length > 1 ? `Genres` : `Genre`;
  return `<td class="film-details__term">${title}</td>
    <td class="film-details__cell">
      ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
    </td>`;
};

const renderEmoji = (emoji) => {
  return emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}" data-emotion="${emoji}">` : ``;
};

const createCommentTemplate = (comment, isDeleting, currentCommentId) => {
  const {id, text, emoji, author, date} = comment;
  return `<li class="film-details__comment" data-comment-id="${id}">
    <span class="film-details__comment-emoji">
      ${emoji ? renderEmoji(emoji) : ``}
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
        <button class="film-details__comment-delete" ${isDeleting ? `disabled` : ``}>${isDeleting && id === currentCommentId ? `Deleting...` : `Delete`}</button>
      </p>
    </div>
  </li>`;
};

const createPopupCommentsTemplate = (comments, isDeleting, currentCommentId) => {
  let commentsList = [];
  if (comments) {
    commentsList = comments.map((item) => createCommentTemplate(item, isDeleting, currentCommentId));
  }

  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsList.length}</span></h3>
    <ul class="film-details__comments-list">
      ${commentsList.join(``)}
    </ul>`;
};

const createPopupCommentsBlockTemplate = (comments, newEmoji, newCommentText, isDisabled, isDeleting, currentCommentId) => {

  return `<section class="film-details__comments-wrap">
    ${comments === null
    ? `<h3 class="film-details__comments-title">Comments has not been loaded</h3>`
    : createPopupCommentsTemplate(comments, isDeleting, currentCommentId)}

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${newEmoji ? renderEmoji(newEmoji) : ``}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${comments === null || isDisabled ? `disabled` : ``}>${newCommentText}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newEmoji === `smile` ? `checked` : ``} ${comments === null || isDisabled ? `disabled` : ``}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newEmoji === `sleeping` ? `checked` : ``} ${comments === null || isDisabled ? `disabled` : ``}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newEmoji === `puke` ? `checked` : ``} ${comments === null || isDisabled ? `disabled` : ``}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newEmoji === `angry` ? `checked` : ``} ${comments === null || isDisabled ? `disabled` : ``}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>
</section>`;
};

const createPopupTemplate = (data, currentCommentId) => {
  const {name, originalName, poster, rating, director, writers, actors, releaseDate, duration, country, genres, description, isInWatchlist, isWatched, isFavorite, ageRating, newEmoji, newCommentText, comments, isDisabled, isDeleting} = data;
  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${name}">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">${originalName}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeDate(releaseDate, `DD MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${humanizeDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                ${createGenresListTemplate(genres)}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${renderControlsState(isInWatchlist)} ${isDisabled ? `disabled` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${renderControlsState(isWatched)} ${isDisabled ? `disabled` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${renderControlsState(isFavorite)} ${isDisabled ? `disabled` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
      ${createPopupCommentsBlockTemplate(comments, newEmoji, newCommentText, isDisabled, isDeleting, currentCommentId)}
      </div>
    </form>
  </section>`;
};


export default class FilmPopup extends SmartView {
  constructor(film, filmComments) {
    super();
    this._data = FilmPopup.parseFilmToData(film, filmComments);
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._newEmojiChoseHandler = this._newEmojiChoseHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this.currentCommentId = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data, this.currentCommentId);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.clickClose);
    this.setWatchlistClickHandler(this._callback.clickToWatch);
    this.setWatchedClickHandler(this._callback.clickWatched);
    this.setFavoriteClickHandler(this._callback.clickFavorite);
    this.setCommentDeleteHandler(this._callback.delete);
    this.setCommentAddHandler(this._callback.add);
  }

  _newEmojiChoseHandler(evt) {
    evt.preventDefault();
    if (evt.target.checked === true) {
      this.updateData({
        newEmoji: evt.target.value,
      });
    }
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value
    }, true);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.clickClose();
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.closest(`.film-details__comment`).dataset.commentId;
    this.currentCommentId = commentId;

    this._callback.delete(commentId);
  }

  _addCommentHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      evt.preventDefault();
      const emojiFieldElement = this.getElement().querySelector(`.film-details__add-emoji-label img`);
      const textFieldElement = this.getElement().querySelector(`.film-details__comment-input`);

      if (textFieldElement.value && emojiFieldElement) {
        const newComment = {
          text: textFieldElement.value,
          emoji: emojiFieldElement.dataset.emotion,
          date: humanizeDate(dayjs(), `YYYY/MM/DD HH:mm`)
        };
        this._callback.add(newComment);
      }
    }
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

  _setInnerHandlers() {
    const emojiChooserElements = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    for (const chooser of emojiChooserElements) {
      chooser.addEventListener(`click`, this._newEmojiChoseHandler);
    }
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentInputHandler);
  }

  setClickHandler(callback) {
    this._callback.clickClose = callback;
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._clickHandler);
  }

  setCommentDeleteHandler(callback) {
    this._callback.delete = callback;
    const deleteButtonElements = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    if (deleteButtonElements) {
      for (const button of deleteButtonElements) {
        button.addEventListener(`click`, this._deleteCommentHandler);
      }
    }
  }

  setCommentAddHandler(callback) {
    this._callback.add = callback;
    this.getElement()
      .querySelector(`form`)
      .addEventListener(`keydown`, this._addCommentHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.clickToWatch = callback;
    this.getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`change`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.clickWatched = callback;
    this.getElement()
      .querySelector(`#watched`)
      .addEventListener(`change`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`change`, this._favoriteClickHandler);
  }

  static parseFilmToData(film, filmComments) {
    return Object.assign(
        {},
        film,
        {
          isDisabled: false,
          isDeleting: false,
          comments: filmComments,
        }
    );
  }
}
