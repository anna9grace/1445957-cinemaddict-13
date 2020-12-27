import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = {};
  }

  setComments(films) {
    films.forEach((film) => {
      this._comments[film.id] = film.comments;
    });
  }

  getComments(film) {
    return this._comments[film.id];
  }


  addComment(updateType, update) {
    const filmId = update.id;
    const newComment = update.comments;

    this._comments[filmId].push(newComment);

    const updatedFilm = Object.assign({}, update, {comments: this._comments[filmId]});
    this._notify(updateType, updatedFilm);
  }


  deleteComment(updateType, update) {
    const filmId = update.id;
    const commentId = update.comments;
    const index = this._comments[filmId].findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[filmId] = [
      ...this._comments[filmId].slice(0, index),
      ...this._comments[filmId].slice(index + 1)
    ];

    const updatedFilm = Object.assign({}, update, {comments: this._comments[filmId]});
    this._notify(updateType, updatedFilm);
  }
}
