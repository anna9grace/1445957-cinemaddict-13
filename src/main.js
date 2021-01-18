import NavigationView from "./view/navigation.js";
import FooterStatsView from "./view/short-stats.js";
import StatisticsView from "./view/statistics.js";
// import {generateFilm} from "./mock/film.js";
import {RenderPosition, render} from "./utils/render.js";
import {MenuItem, UpdateType} from "./utils/constants.js";
import MovieBoardPresenter from "./presenter/moviesBoard.js";
import FilterBoardPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filters.js";
import CommentsModel from "./model/comments.js";
import Api from "./api.js";

// const MOCK_FILMS_COUNT = 22;
const AUTHORIZATION = `Basic afaifjwio4335l`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);

// const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
// console.log(filmsCollection);
const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
})
.catch(() => {
  filmsModel.setFilms(UpdateType.INIT, []);
});


const navigationComponent = new NavigationView();

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement, filmsModel, filterModel, commentsModel, api);
const filterBoardPresenter = new FilterBoardPresenter(navigationComponent, pageHeaderElement, filmsModel, filterModel);

render(pageMainElement, RenderPosition.BEFOREEND, navigationComponent);

filterBoardPresenter.init();
moviesBoardPresenter.init();

const statisticsComponent = new StatisticsView();
render(pageMainElement, RenderPosition.BEFOREEND, statisticsComponent);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView());


const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      moviesBoardPresenter.showFilmsBoard();
      statisticsComponent.hide();
      break;
    case MenuItem.STATISTICS:
      moviesBoardPresenter.hideFilmsBoard();
      filterBoardPresenter.resetFilter();
      statisticsComponent.show();
      statisticsComponent.setWatchedFilms(filmsModel.getFilms());
      break;
  }
};


navigationComponent.setMenuClickHandler(handleMenuClick);
statisticsComponent.hide();
