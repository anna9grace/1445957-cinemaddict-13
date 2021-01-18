import Observer from "../utils/observer.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          name: film.film_info.title,
          originalName: film.film_info.alternative_title,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          releaseDate: new Date(film.film_info.release.date),
          duration: dayjs.duration(film.film_info.runtime, `minutes`),
          country: film.film_info.release.release_country,
          genres: film.film_info.genre,
          description: film.film_info.description,
          ageRating: `${film.film_info.age_rating}+`,
          isInWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          watchDate: new Date(film.user_details.watching_date),
          isFavorite: film.user_details.favorite,
          commentsId: film.comments,
          newEmoji: null,
          newCommentText: ``,
        }
    );

    delete adaptedFilm.comments;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }


  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "comments": film.commentsId,
          "film_info": {
            "title": film.name,
            "alternative_title": film.originalName,
            "total_rating": film.rating,
            "poster": film.poster,
            "age_rating": parseInt(film.ageRating, 10),
            "director": film.director,
            "writers": film.writers,
            "actors": film.actors,
            "release": {
              "date": film.releaseDate.toISOString(),
              "release_country": film.country
            },
            "runtime": parseInt(dayjs.duration(film.duration).as(`minutes`), 10),
            "genre": film.genres,
            "description": film.description,
          },
          "user_details": {
            "watchlist": film.isInWatchlist,
            "already_watched": film.isWatched,
            "watching_date": film.watchDate.toISOString(),
            "favorite": film.isFavorite,
          }
        }
    );

    delete film.name;
    delete film.originalName;
    delete film.poster;
    delete film.rating;
    delete film.director;
    delete film.writers;
    delete film.actors;
    delete film.releaseDate;
    delete film.duration;
    delete film.country;
    delete film.genres;
    delete film.description;
    delete film.ageRating;
    delete film.isInWatchlist;
    delete film.isWatched;
    delete film.watchDate;
    delete film.isFavorite;
    delete film.commentsId;
    delete film.newEmoji;
    delete film.newCommentText;

    return adaptedFilm;
  }
}
