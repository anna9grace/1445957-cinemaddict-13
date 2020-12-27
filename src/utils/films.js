import dayjs from "dayjs";

const sortByComments = (films) => {
  return films.sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);
};

export const sortByRating = (films) => {
  return films.sort((a, b) => a.rating < b.rating ? 1 : -1);
};

export const sortByDate = (films) => {
  return films.sort((filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate)));
};

export const getTopCommentedFilms = (films) => {
  const commentedFilms = films.filter((film) => film.comments.length > 0);
  return sortByComments(commentedFilms);
};

export const getTopRatedFilms = (films) => {
  const ratedFilms = films.filter((film) => +film.rating !== 0);
  return sortByRating(ratedFilms);
};
