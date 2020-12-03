import UserProfileView from "./view/user-profile.js";
import FiltersView from "./view/filters.js";
import SortView from "./view/sort.js";
import FilmsBlockView from "./view/films-block.js";
import FilmsListView from "./view/films-list.js";
import TopRatedListView from "./view/top-rated-films.js";
import TopCommentedListView from "./view/top-commented-films.js";
import NoFilmsView from "./view/no-films.js";
import FilmCardView from "./view/film-card.js";
import LoadMoreButtonView from "./view/show-more.js";
import FooterStatsView from "./view/stats.js";
import FilmPopupView from "./view/popup.js";
import {generateFilm} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {getWatchedFilms, RenderPosition, render, getContainer} from "./util.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;
const MOCK_FILMS_COUNT = 22;

const pageBodyElement = document.querySelector(`body`);
const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const statsElement = document.querySelector(`.footer__statistics`);
const footerElement = document.querySelector(`.footer`);

const filmsCollection = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(filmsCollection);
const watchedFilmsCount = getWatchedFilms(filmsCollection);
const topRatedFilms = filmsCollection
  .filter((film) => +film.rating !== 0)
  .sort((a, b) => a.rating < b.rating ? 1 : -1);
const topCommentedFilms = filmsCollection
  .filter((film) => film.comments !== null)
  .sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);


const renderFilm = (filmsList, film) => {
  const filmCardComponent = new FilmCardView(film);
  filmCardComponent.setClickHandler(() => {
    renderPopup(footerElement, film);
  });
  render(filmsList, RenderPosition.BEFOREEND, filmCardComponent.getElement());
};


const renderPopup = (popupContainer, film) => {
  const filmPopupComponent = new FilmPopupView(film);

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
  filmPopupComponent.setClickHandler(() => {
    closePopup();
  });
  render(popupContainer, RenderPosition.AFTEREND, filmPopupComponent.getElement());
  pageBodyElement.classList.add(`hide-overflow`);
};


const renderTopList = (topContainer, topList, topFilms) => {
  if (topFilms.length > 0) {
    for (let i = 0; i < TOP_FILMS_COUNT; i++) {
      renderFilm(getContainer(topList), topFilms[i]);
    }
    render(topContainer, RenderPosition.BEFOREEND, topList.getElement());
  }
};


const renderFilmsBlock = (filmsContainer, films) => {
  const filmsBlockComponent = new FilmsBlockView();
  render(filmsContainer, RenderPosition.BEFOREEND, filmsBlockComponent.getElement());

  if (films.length === 0) {
    render(filmsBlockComponent.getElement(), RenderPosition.BEFOREEND, new NoFilmsView().getElement());
    return;
  }

  const filmsListComponent = new FilmsListView();
  const containerElement = getContainer(filmsListComponent);
  for (let i = 0; i < Math.min(FILMS_COUNT, films.length); i++) {
    renderFilm(containerElement, films[i]);
  }
  render(filmsListComponent.getElement(), RenderPosition.BEFOREEND, containerElement);
  render(filmsBlockComponent.getElement(), RenderPosition.BEFOREEND, filmsListComponent.getElement());
  render(filmsBlockComponent.getElement(), RenderPosition.BEFOREBEGIN, new SortView().getElement());
  renderTopList(filmsBlockComponent.getElement(), new TopRatedListView(), topRatedFilms);
  renderTopList(filmsBlockComponent.getElement(), new TopCommentedListView(), topCommentedFilms);


  if (films.length > FILMS_COUNT) {
    let shownFilmsCount = FILMS_COUNT;
    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(filmsListComponent.getElement(), RenderPosition.BEFOREEND, loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.setClickHandler(() => {
      films
        .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT)
        .forEach((film) => renderFilm(containerElement, film));
      shownFilmsCount += FILMS_COUNT;

      if (films.length <= shownFilmsCount) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(pageHeaderElement, RenderPosition.BEFOREEND, new UserProfileView(watchedFilmsCount).getElement());
render(pageMainElement, RenderPosition.BEFOREEND, new FiltersView(filters).getElement());
renderFilmsBlock(pageMainElement, filmsCollection);
render(statsElement, RenderPosition.BEFOREEND, new FooterStatsView().getElement());
