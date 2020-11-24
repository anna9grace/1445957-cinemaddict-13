import {createUserProfileTemplate} from "./view/user-profile.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createTopFilmsTemplate} from "./view/top-films.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createStatisticsTemplate} from "./view/stats.js";
// import {createPopupTemplate} from "./view/popup.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {getWatchedFilms} from "./util.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;
const MOCK_FILMS_COUNT = 18;

const films = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);
const watchedFilmsCount = getWatchedFilms(films);

const renderHtml = (element, position, template) => {
  element.insertAdjacentHTML(position, template);
};

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
// const footerElement = document.querySelector(`.footer`);

renderHtml(pageHeaderElement, `beforeend`, createUserProfileTemplate(watchedFilmsCount));
renderHtml(pageMainElement, `beforeend`, createFiltersTemplate(filters));
renderHtml(pageMainElement, `beforeend`, createSortTemplate());
renderHtml(pageMainElement, `beforeend`, createFilmsListTemplate());
renderHtml(statsElement, `beforeend`, createStatisticsTemplate());
// renderHtml(footerElement, `afterend`, createPopupTemplate(films[0]));

const filmsElement = pageMainElement.querySelector(`.films-list`);
renderHtml(filmsElement, `afterend`, createTopFilmsTemplate());

const filmsListElement = filmsElement.querySelector(`.films-list__container`);
const topFilmsElement = pageMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < Math.min(FILMS_COUNT, films.length); i++) {
  renderHtml(filmsListElement, `beforeend`, createFilmCardTemplate(films[i]));
}

for (let list of topFilmsElement) {
  for (let i = 0; i < TOP_FILMS_COUNT; i++) {
    renderHtml(list, `beforeend`, createFilmCardTemplate(films[i]));
  }
}


if (films.length > FILMS_COUNT) {
  let shownFilmsCount = FILMS_COUNT;

  renderHtml(filmsElement, `beforeend`, createShowMoreTemplate());
  const showMoreButton = filmsElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT)
      .forEach((film) => renderHtml(filmsListElement, `beforeend`, createFilmCardTemplate(film)));

    shownFilmsCount += FILMS_COUNT;

    if (films.length <= shownFilmsCount) {
      showMoreButton.remove();
    }
  });
}
