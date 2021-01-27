import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = (comments === null) ? comments : comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = update.comments.slice();

    this._notify(updateType, update.film);
  }

  deleteComment(updateType, update) {
    const film = update.film;
    const commentId = update.comment;
    const index = this._comments.findIndex((comment) => comment.id === commentId);
    const indexInFilm = film.commentsId.findIndex((id) => id === commentId);

    if (index === -1 || indexInFilm === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    film.commentsId = [
      ...film.commentsId.slice(0, indexInFilm),
      ...film.commentsId.slice(indexInFilm + 1)
    ];

    this._notify(updateType, film);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          text: comment.comment,
          emoji: comment.emotion,
          date: new Date(comment.date),
        }
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "comment": comment.text,
          "date": dayjs(comment.date).toISOString(),
          "emotion": comment.emoji,
        }
    );

    delete adaptedComment.text;
    delete adaptedComment.emoji;
    return adaptedComment;
  }
}
