import FilmsModel from "../model/films.js";
import {isOnline} from "../utils/util.js";


const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};


const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};


export default class Provider {
  constructor(api, filmsStore) {
    this._api = api;
    this._filmsStore = filmsStore;

    this._isSyncronize = false;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._filmsStore.setItems(items);
          return films;
        });
    }

    const storedFilms = Object.values(this._filmsStore.getItems());
    return Promise.resolve(storedFilms.map(FilmsModel.adaptToClient));
  }


  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film);
    }

    return Promise.resolve([]);
  }


  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._filmsStore.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._isSyncronize = true;
    this._filmsStore.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));
    return Promise.resolve(film);
  }


  addComment(commentUpdate) {
    if (isOnline()) {
      return this._api.addComment(commentUpdate)
        .then(({film, comments}) => {
          this._filmsStore.setItem(film.id, FilmsModel.adaptToServer(film));
          return {film, comments};
        });
    }

    return Promise.reject(new Error(`Adding new comment failed`));
  }


  deleteComment(commentUpdate) {
    if (isOnline()) {
      return this._api.deleteComment(commentUpdate);
    }

    return Promise.reject(new Error(`Comment deletion failed`));
  }


  get isSyncronize() {
    return this._isSyncronize;
  }


  sync() {
    if (isOnline()) {
      const storedFilms = Object.values(this._filmsStore.getItems());

      return this._api.sync(storedFilms)
      .then((response) => {
        const updatedFilms = getSyncedFilms(response.updated);

        const items = createStoreStructure([...updatedFilms]);

        this._filmsStore.setItems(items);
      });
    }

    this._isSyncronize = false;
    return Promise.reject(new Error(`Sync data failed`));
  }

}
