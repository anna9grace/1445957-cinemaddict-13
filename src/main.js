import {createUserProfileTemplate} from "./view/user-profile.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import FilmsBlockView from "./view/films-block.js";
import FilmsListView from "./view/films-list.js";
import TopListView from "./view/top-films.js";
import FilmCardView from "./view/film-card.js";
import LoadMoreButtonView from "./view/show-more.js";
import {createStatisticsTemplate} from "./view/stats.js";
// import {createPopupTemplate} from "./view/popup.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {getWatchedFilms, RenderPosition, render} from "./util.js";


const FILMS_COUNT = 5;
// const TOP_FILMS_COUNT = 2;
const MOCK_FILMS_COUNT = 22;

const films = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);
const watchedFilmsCount = getWatchedFilms(films);

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);

const renderHtml = (element, position, template) => {
  element.insertAdjacentHTML(position, template);
};
// const footerElement = document.querySelector(`.footer`);


renderHtml(pageHeaderElement, `beforeend`, createUserProfileTemplate(watchedFilmsCount));
renderHtml(pageMainElement, `beforeend`, createFiltersTemplate(filters));
renderHtml(pageMainElement, `beforeend`, createSortTemplate());

renderHtml(statsElement, `beforeend`, createStatisticsTemplate());


const renderFilm = (filmsList, film) => {
  const filmCardComponent = new FilmCardView(film);
  render(filmsList, RenderPosition.BEFOREEND, filmCardComponent.getElement());
};


const renderFilmsBlock = (filmsContainer, filmsEl) => {
  const filmsBlockComponent = new FilmsBlockView();
  const filmsListComponent = new FilmsListView();
  const topListComponent = new TopListView();

  render(filmsContainer, RenderPosition.BEFOREEND, filmsBlockComponent.getElement());
  render(filmsBlockComponent.getElement(), RenderPosition.BEFOREEND, filmsListComponent.getElement());
  render(filmsBlockComponent.getElement(), RenderPosition.BEFOREEND, topListComponent.getElement());

  const filmsListContainer = document.querySelector(`.films-list__container`);


  for (let i = 0; i < Math.min(FILMS_COUNT, filmsEl.length); i++) {
    renderFilm(filmsListContainer, filmsEl[i]);
  }

  // for (let list of topFilmsElement) {
  //   for (let i = 0; i < TOP_FILMS_COUNT; i++) {
  //     renderFilm(list, `beforeend`, createFilmCardTemplate(films[i]));
  //   }
  // }

  if (filmsEl.length > FILMS_COUNT) {
    let shownFilmsCount = FILMS_COUNT;
    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(filmsListComponent.getElement(), RenderPosition.BEFOREEND, loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      filmsEl
        .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT)
        .forEach((film) => renderFilm(filmsListContainer, film));

      shownFilmsCount += FILMS_COUNT;

      if (filmsEl.length <= shownFilmsCount) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

renderFilmsBlock(pageMainElement, films);


// renderHtml(footerElement, `afterend`, createPopupTemplate(films[0]));


