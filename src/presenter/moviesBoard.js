import FilmsBlockView from "../view/films-block.js";
import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
// import TopRatedListView from "./view/top-rated-films.js";
// import TopCommentedListView from "./view/top-commented-films.js";
import LoadMoreButtonView from "../view/show-more.js";
import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/popup.js";
import {RenderPosition, render, removeElement, getContainer} from "../utils/render.js";

const FILMS_COUNT = 5;


export default class moviesBoard {
  constructor(filmsContainer, popupContainer) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmsCount = FILMS_COUNT;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadMoreComponent = new LoadMoreButtonView();
    // this._topRatedComponent = new TopRatedListView();
    // this._topCommentedComponent = new TopCommentedListView();
    this._sortComponent = new SortView();
  }


  init(filmsCollection) {
    this._filmsCollection = filmsCollection;

    render(this._filmsContainer, RenderPosition.BEFOREEND, this._filmsBlockComponent);
    this._renderFilmsBlock();
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


  _renderFilms(from, to, filmsList) {
    this._filmsCollection
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, filmsList));
  }


  _renderFilmsList() {
    const listContainer = getContainer(this._filmsListComponent);
    this._renderFilms(0, Math.min(this._filmsCollection.length, this._renderedFilmsCount), listContainer);

    render(this._filmsListComponent, RenderPosition.BEFOREEND, listContainer);
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._filmsListComponent);

    if (this._filmsCollection.length > FILMS_COUNT) {
      this._renderLoadMoreButton();
    }
  }


  _renderNoFilms() {
    render(this._filmsBlockComponent, RenderPosition.BEFOREEND, this._noFilmsComponent);
  }


  // _renderTopList(topList, topFilms) {
  //   if (topFilms.length > 0) {
  //     for (let i = 0; i < TOP_FILMS_COUNT; i++) {
  //       renderFilm(getContainer(topList), topFilms[i]);
  //     }
  //     render(this._filmsBlockComponent, RenderPosition.BEFOREEND, topList);
  //   }
  // }


  _renderLoadMoreButton() {
    render(this._filmsListComponent, RenderPosition.BEFOREEND, this._loadMoreComponent);
  }


  _renderFilmsBlock() {
    if (this._filmsCollection.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmsList();
    // this._renderTopList(this._topRatedComponent, topRatedFilms)
    // this._renderTopList(this._topCommentedComponent, topCommentedFilms)
  }
}
