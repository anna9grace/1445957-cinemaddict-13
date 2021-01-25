import NavigationView from "./view/navigation.js";
import FooterStatsView from "./view/short-stats.js";
import StatisticsView from "./view/statistics.js";
import {RenderPosition, render} from "./utils/render.js";
import {MenuItem, UpdateType} from "./utils/constants.js";
import MovieBoardPresenter from "./presenter/moviesBoard.js";
import FilterBoardPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filters.js";
import CommentsModel from "./model/comments.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";


const AUTHORIZATION = `Basic afaifjwio4335l`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const TITLE_ONLINE = `Cinemaddict`;
const TITLE_OFFLINE = `Cinemaddict [offline]`;

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);
const pageTitle = document.querySelector(`.header__logo`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);


const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();


const navigationComponent = new NavigationView();

const moviesBoardPresenter = new MovieBoardPresenter(pageMainElement, footerElement, filmsModel, filterModel, commentsModel, apiWithProvider);
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
  pageTitle.textContent = TITLE_ONLINE;


  if (apiWithProvider.isSyncronize) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  pageTitle.textContent = TITLE_OFFLINE;
});
