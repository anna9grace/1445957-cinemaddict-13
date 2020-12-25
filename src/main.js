import UserProfileView from "./view/user-profile.js";
import FooterStatsView from "./view/stats.js";
import {generateFilm} from "./mock/film.js";
import {getWatchedFilms} from "./utils/util.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieBoardPresenter from "./presenter/moviesBoard.js";
import FilterBoardPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filters.js";

const MOCK_FILMS_COUNT = 22;

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);

const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCollection);

const filterModel = new FilterModel();

const watchedFilmsCount = getWatchedFilms(filmsCollection);

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement, filmsModel, filterModel);
const filterBoardPresenter = new FilterBoardPresenter(pageMainElement, filmsModel, filterModel);

render(pageHeaderElement, RenderPosition.BEFOREEND, new UserProfileView(watchedFilmsCount));
filterBoardPresenter.init();
moviesBoardPresenter.init();
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView());
