import UserProfileView from "./view/user-profile.js";
import FiltersView from "./view/filters.js";
import FooterStatsView from "./view/stats.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {getWatchedFilms} from "./utils/util.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieBoardPresenter from "./presenter/moviesBoard.js";

const MOCK_FILMS_COUNT = 22;

// const pageBodyElement = document.querySelector(`body`);
const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);

const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(filmsCollection);
const watchedFilmsCount = getWatchedFilms(filmsCollection);

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement);

render(pageHeaderElement, RenderPosition.BEFOREEND, new UserProfileView(watchedFilmsCount));
render(pageMainElement, RenderPosition.BEFOREEND, new FiltersView(filters));
moviesBoardPresenter.init(filmsCollection);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView());
