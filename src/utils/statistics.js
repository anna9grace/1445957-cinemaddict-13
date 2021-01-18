import {RankMinFilmsWatched} from "./constants.js";
import {makeItemsUnique} from "../utils/util.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(duration);
dayjs.extend(isBetween);


export const getProfileRank = (watchedFilms) => {
  let profileRank = null;

  Object.entries(RankMinFilmsWatched).forEach(([minCount, rank]) => {
    if (watchedFilms.length >= +minCount) {
      profileRank = rank;
    }
  });
  return profileRank;
};

export const getTotalWatchingTime = (watchedFilms) => {
  return watchedFilms.length > 0
    ? watchedFilms.reduce((time, film) => time.add(film.duration), dayjs.duration(0))
    : null;
};

export const countFilmsByGenre = (filmGenres, genre) => {
  return filmGenres.filter((filmGenre) => filmGenre === genre).length;
};

export const getFilmsWatchedInPeriod = (watchedFilms, dateFrom, dateTo) => {
  return dateFrom === null
    ? watchedFilms
    : watchedFilms.filter(
        (film) => dayjs(film.watchDate).isBetween(dateFrom, dateTo)
    );
};

export const getSortedUniqueGenres = (watchedGenres) => {
  const genres = watchedGenres;
  return makeItemsUnique(genres).sort((genreA, genreB) => {
    return countFilmsByGenre(watchedGenres, genreA)
          < countFilmsByGenre(watchedGenres, genreB) ? 1 : -1;
  });
};
