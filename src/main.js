import NavigationView from "./view/navigation.js";
import FooterStatsView from "./view/footer-stats.js";
import StatisticsView from "./view/statistics.js";
import MovieBoardPresenter from "./presenter/movies-board.js";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filters.js";
import CommentsModel from "./model/comments.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {RenderPosition, render} from "./utils/render.js";
import {MenuItem, UpdateType} from "./utils/constants.js";


const AUTHORIZATION = `Basic afaifjwio4335l`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const PageTitles = {
  ONLINE: `Cinemaddict`,
  OFFLINE: `Cinemaddict [offline]`,
};


const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const statsElement = footerElement.querySelector(`.footer__statistics`);
const pageTitleElement = pageHeaderElement.querySelector(`.header__logo`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const navigationComponent = new NavigationView();
const statisticsComponent = new StatisticsView();

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement, filmsModel, filterModel, commentsModel, apiWithProvider);
const filterPresenter = new FilterPresenter(navigationComponent, pageHeaderElement, filmsModel, filterModel);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      moviesBoardPresenter.showFilmsBoard();
      statisticsComponent.hide();
      break;
    case MenuItem.STATISTICS:
      moviesBoardPresenter.hideFilmsBoard();
      filterPresenter.resetFilter();
      statisticsComponent.show();
      statisticsComponent.setWatchedFilms(filmsModel.getFilms());
      break;
  }
};

render(pageMainElement, RenderPosition.BEFOREEND, navigationComponent);
filterPresenter.init();
moviesBoardPresenter.init();
render(pageMainElement, RenderPosition.BEFOREEND, statisticsComponent);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView());

navigationComponent.setMenuClickHandler(handleMenuClick);
statisticsComponent.hide();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  pageTitleElement.textContent = PageTitles.ONLINE;

  if (apiWithProvider.isSyncronize) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  pageTitleElement.textContent = PageTitles.OFFLINE;
});
