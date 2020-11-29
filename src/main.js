import UserProfileView from "./view/user-profile.js";
import FiltersView from "./view/filters.js";
import SortView from "./view/sort.js";
import FilmsBlockView from "./view/films-block.js";
import FilmsListView from "./view/films-list.js";
import TopRatedListView from "./view/top-rated-films.js";
import TopCommentedListView from "./view/top-commented-films.js";
import FilmCardView from "./view/film-card.js";
import LoadMoreButtonView from "./view/show-more.js";
import FooterStatsView from "./view/stats.js";
import FilmPopupView from "./view/popup.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {getWatchedFilms, RenderPosition, render} from "./util.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;
const MOCK_FILMS_COUNT = 22;

const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(filmsCollection);
const watchedFilmsCount = getWatchedFilms(filmsCollection);
const topRatedFilms = filmsCollection
  .filter((film) => +film.rating !== 0)
  .sort((a, b) => a.rating < b.rating ? 1 : -1);
const topCommentedFilms = filmsCollection
  .filter((film) => film.comments !== null)
  .sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);

const pageBodyElement = document.querySelector(`body`);
const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);


const renderFilm = (filmsList, film) => {
  const filmCardComponent = new FilmCardView(film);
  const openPopupElements = filmCardComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);

  for (let element of openPopupElements) {
    element.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      renderPopup(footerElement, film);
    });
  }
  render(filmsList, RenderPosition.BEFOREEND, filmCardComponent.getElement());
};


const renderPopup = (popupContainer, film) => {
  const filmPopupComponent = new FilmPopupView(film);
  const closePopupElement = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);

  const closePopup = () => {
    filmPopupComponent.getElement().remove();
    filmPopupComponent.removeElement();
    document.removeEventListener(`keydown`, onEscKeyDown);
    pageBodyElement.classList.remove(`hide-overflow`);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closePopup();
    }
  };

  document.addEventListener(`keydown`, onEscKeyDown);
  closePopupElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    closePopup();
  });
  render(popupContainer, RenderPosition.AFTEREND, filmPopupComponent.getElement());
  pageBodyElement.classList.add(`hide-overflow`);
};


const renderTopList = (topContainer, topList, topFilms) => {
  if (topFilms) {
    const filmsWrapperElement = topList.getElement().querySelector(`.films-list__container`);

    for (let i = 0; i < TOP_FILMS_COUNT; i++) {
      renderFilm(filmsWrapperElement, topFilms[i]);
    }
    render(topContainer, RenderPosition.BEFOREEND, topList.getElement());
  }
};


const renderFilmsBlock = (filmsContainer, films) => {
  render(filmsContainer, RenderPosition.BEFOREEND, new FiltersView(filters).getElement());
  render(filmsContainer, RenderPosition.BEFOREEND, new SortView().getElement());

  const filmsBlockComponent = new FilmsBlockView();
  const filmsListComponent = new FilmsListView();
  const filmsWrapperElement = filmsListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(FILMS_COUNT, films.length); i++) {
    renderFilm(filmsWrapperElement, films[i]);
  }
  render(filmsListComponent.getElement(), RenderPosition.BEFOREEND, filmsWrapperElement);
  render(filmsBlockComponent.getElement(), RenderPosition.BEFOREEND, filmsListComponent.getElement());
  render(filmsContainer, RenderPosition.BEFOREEND, filmsBlockComponent.getElement());
  renderTopList(filmsBlockComponent.getElement(), new TopRatedListView(), topRatedFilms);
  renderTopList(filmsBlockComponent.getElement(), new TopCommentedListView(), topCommentedFilms);


  if (films.length > FILMS_COUNT) {
    let shownFilmsCount = FILMS_COUNT;
    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(filmsListComponent.getElement(), RenderPosition.BEFOREEND, loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT)
        .forEach((film) => renderFilm(filmsWrapperElement, film));

      shownFilmsCount += FILMS_COUNT;

      if (films.length <= shownFilmsCount) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};


render(pageHeaderElement, RenderPosition.BEFOREEND, new UserProfileView(watchedFilmsCount).getElement());
renderFilmsBlock(pageMainElement, filmsCollection);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView().getElement());
