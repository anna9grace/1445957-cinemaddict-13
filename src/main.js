import {createUserProfileTemplate} from "./view/user-profile.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createTopFilmsTemplate} from "./view/top-films.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createStatisticsTemplate} from "./view/stats.js";
import {generateFilm} from "./mock/film.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
console.log(films);

const renderHtml = (element, position, template) => {
  element.insertAdjacentHTML(position, template);
};

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);

renderHtml(pageHeaderElement, `beforeend`, createUserProfileTemplate());
renderHtml(pageMainElement, `beforeend`, createMenuTemplate());
renderHtml(pageMainElement, `beforeend`, createFilmsListTemplate());
renderHtml(statsElement, `beforeend`, createStatisticsTemplate());

const filmsElement = pageMainElement.querySelector(`.films-list`);

renderHtml(filmsElement, `afterend`, createTopFilmsTemplate());
renderHtml(filmsElement, `beforeend`, createShowMoreTemplate());

const filmsListElement = filmsElement.querySelector(`.films-list__container`);
const topFilmsElement = pageMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  renderHtml(filmsListElement, `beforeend`, createFilmCardTemplate());
}

for (let list of topFilmsElement) {
  for (let i = 0; i < TOP_FILMS_COUNT; i++) {
    renderHtml(list, `beforeend`, createFilmCardTemplate());
  }
}

