import {getWatchedFilms} from "../util.js";

const filmsFilterMap = {
  Watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
  History: (films) => getWatchedFilms(films),
  Favorites: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmsFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
