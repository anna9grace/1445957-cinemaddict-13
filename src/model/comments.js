import Observer from "../utils/observer.js";
// import {generateComments} from "../mock/comments.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    // const idCollection = [];
    // commentsIds.forEach((ids) => idCollection.push(...ids));
    // idCollection.forEach((id) => this._comments.push(generateComments(id)));
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }


  addComment(updateType, update) {
    const film = update.film;
    const newComment = update.comment;

    this._comments.push(newComment);
    film.commentsId.push(newComment.id);

    this._notify(updateType, film);
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
          "date": comment.date.toISOString(),
          "emotion": comment.emoji,
        }
    );

    delete adaptedComment.text;
    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
