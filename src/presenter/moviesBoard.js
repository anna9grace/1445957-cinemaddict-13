import FilmsBlockView from "../view/films-block.js";
import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedListView from "../view/top-rated-films.js";
import TopCommentedListView from "../view/top-commented-films.js";
import LoadMoreButtonView from "../view/show-more.js";
import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/popup.js";
import {RenderPosition, render, removeElement, getContainer} from "../utils/render.js";
import {getTopCommentedFilms, getTopRatedFilms} from "../utils/films.js";

const FILMS_COUNT = 5;
const TOP_FILMS_COUNT = 2;


export default class moviesBoard {
  constructor(filmsContainer, popupContainer) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmsCount = FILMS_COUNT;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadMoreComponent = new LoadMoreButtonView();
    this._topRatedComponent = new TopRatedListView();
    this._topCommentedComponent = new TopCommentedListView();
    this._sortComponent = new SortView();

    this._handleLoadMoreClick = this._handleLoadMoreClick.bind(this);
  }


  init(filmsCollection) {
    this._filmsCollection = filmsCollection;

    render(this._filmsContainer, RenderPosition.BEFOREEND, this._filmsBlockComponent);
    this._renderFilmsBlock(filmsCollection);
  }


  _renderSort() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREBEGIN, this._sortComponent);
  }


  _renderFilm(film, filmsList) {
    const filmCardComponent = new FilmCardView(film);
    filmCardComponent.setClickHandler(() => {
      this._renderPopup(film);
    });
    render(filmsList, RenderPosition.BEFOREEND, filmCardComponent);
  }


  _renderPopup(film) {
    const filmPopupComponent = new FilmPopupView(film);

    const closePopup = () => {
      removeElement(filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
      // pageBodyElement.classList.remove(`hide-overflow`);
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
    render(this._popupContainer, RenderPosition.AFTEREND, filmPopupComponent);
    // pageBodyElement.classList.add(`hide-overflow`);
  }


  _renderFilms(from, to) {
    const container = getContainer(this._filmsListComponent);
    this._filmsCollection
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, container));
  }


  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._filmsCollection.length, this._renderedFilmsCount));
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._filmsListComponent);

    if (this._filmsCollection.length > FILMS_COUNT) {
      this._renderLoadMoreButton();
    }
  }


  _renderNoFilms() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._noFilmsComponent);
  }


  _renderTopList(topFilms, topList) {
    const container = getContainer(topList);
    if (topFilms.length > 0) {
      for (let i = 0; i < Math.min(topFilms.length, TOP_FILMS_COUNT); i++) {
        this._renderFilm(topFilms[i], container);
      }
      render(this._filmsBlockComponent, RenderPosition.BEFOREEND, topList);
    }
  }


  _handleLoadMoreClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT,
        this._listContainer);
    this._renderedFilmsCount += FILMS_COUNT;

    if (this._filmsCollection.length <= this._renderedFilmsCount) {
      removeElement(this._loadMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, RenderPosition.BEFOREEND, this._loadMoreComponent);
    this._loadMoreComponent.setClickHandler(this._handleLoadMoreClick);
  }

  _renderFilmsBlock(films) {
    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmsList();
    this._renderTopList(getTopRatedFilms(films), this._topRatedComponent);
    this._renderTopList(getTopCommentedFilms(films), this._topCommentedComponent);
  }
}

