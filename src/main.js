import NavigationView from "./view/navigation.js";
import FooterStatsView from "./view/short-stats.js";
import StatisticsView from "./view/statistics.js";
import {generateFilm} from "./mock/film.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieBoardPresenter from "./presenter/moviesBoard.js";
import FilterBoardPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filters.js";
import CommentsModel from "./model/comments.js";

const MOCK_FILMS_COUNT = 22;

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);

const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
filmsModel.setFilms(filmsCollection);
commentsModel.setComments(filmsCollection);

const navigationComponent = new NavigationView();

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement, filmsModel, filterModel, commentsModel);
const filterBoardPresenter = new FilterBoardPresenter(navigationComponent, pageHeaderElement, filmsModel, filterModel);

render(pageMainElement, RenderPosition.BEFOREEND, navigationComponent);

filterBoardPresenter.init();
moviesBoardPresenter.init();

const statisticsComponent = new StatisticsView();
render(pageMainElement, RenderPosition.BEFOREEND, statisticsComponent);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView());


const handleBoardToggle = (isMenuActive) => {
  switch (isMenuActive) {
    case false:
      moviesBoardPresenter.showFilmsBoard();
      statisticsComponent.hide();
      break;
    case true:
      moviesBoardPresenter.hideFilmsBoard();
      statisticsComponent.show();
      break;
  }
};

navigationComponent.setMenuClickHandler(handleBoardToggle);
statisticsComponent.hide();
