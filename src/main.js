import {createUserProfileTemplate} from "./view/user-profile.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createTopFilmsTemplate} from "./view/top-films.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createStatisticsTemplate} from "./view/stats.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;

const renderHtml = (element, position, template) => {
  element.insertAdjacentHTML(position, template);
};

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);

renderHtml(pageHeader, `beforeend`, createUserProfileTemplate());
renderHtml(pageMain, `beforeend`, createMenuTemplate());
renderHtml(pageMain, `beforeend`, createFilmsListTemplate());
renderHtml(footerStats, `beforeend`, createStatisticsTemplate());

const films = pageMain.querySelector(`.films-list`);

renderHtml(films, `afterend`, createTopFilmsTemplate());
renderHtml(films, `beforeend`, createShowMoreTemplate());

const filmsList = films.querySelector(`.films-list__container`);
const topFilmsLists = pageMain.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  renderHtml(filmsList, `beforeend`, createFilmCardTemplate());
}

for (let list of topFilmsLists) {
  for (let i = 0; i < TOP_FILMS_COUNT; i++) {
    renderHtml(list, `beforeend`, createFilmCardTemplate());
  }
}

