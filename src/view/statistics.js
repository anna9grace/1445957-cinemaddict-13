import SmartView from "./smart.js";
import {getProfileRank, getTotalWatchingTime, countFilmsByGenre, getFilmsWatchedInPeriod} from "../utils/statistics.js";
import {makeItemsUnique} from "../utils/util.js";
import {Period} from "../utils/constants.js";
import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';


const createTotalDurationTemplate = (watchedFilms) => {
  const totalTime = getTotalWatchingTime(watchedFilms);
  const hours = !totalTime ? `` : `${totalTime.get(`hours`)} <span class="statistic__item-description">h</span>`;

  return !totalTime ? `0 ` : `${hours}${totalTime.get(`minutes`)} `;
};


const createTopGenreTemplate = (watchedFilms) => {
  const watchedGenres = [];
  watchedFilms.forEach((film) => {
    watchedGenres.push(...film.genres);
  });

  const uniqueGenres = makeItemsUnique(watchedGenres);
  const filmsByGenreCounts = uniqueGenres.map((genre) => countFilmsByGenre(watchedGenres, genre));
  const index = filmsByGenreCounts.findIndex((item) => item === Math.max(...filmsByGenreCounts));

  return `<li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${uniqueGenres[index]}</p>
  </li>`;
};


const createStatisticsTemplate = (data, currentPeriod) => {
  const {watchedFilms, dateFrom, dateTo} = data;
  const rank = getProfileRank(watchedFilms);

  const watchedFilmsInPeriod = (dateFrom !== null)
    ? getFilmsWatchedInPeriod(watchedFilms, dateFrom, dateTo)
    : watchedFilms;

  return `<section class="statistic">
        <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        ${rank ? `<span class="statistic__rank-label">${rank}</span>` : ``}
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${Period.ALL_TIME}" ${currentPeriod === Period.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${Period.TODAY}" ${currentPeriod === Period.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${Period.WEEK}" ${currentPeriod === Period.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${Period.MONTH}" ${currentPeriod === Period.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${Period.YEAR}" ${currentPeriod === Period.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${watchedFilmsInPeriod.length} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">
            ${createTotalDurationTemplate(watchedFilmsInPeriod)}
            <span class="statistic__item-description">m</span></p>
          </li>
          ${watchedFilmsInPeriod.length > 0 ? createTopGenreTemplate(watchedFilmsInPeriod) : ``}
        </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>   
        
    </section>`;
};


export default class Statistics extends SmartView {
  constructor() {
    super();
    this._data = {
      watchedFilms: 0,
      dateFrom: null,
      dateTo: dayjs(),
    };

    this._currentPeriod = Period.ALL_TIME;
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
  }

  updateWatchedFilms(films, date = null) {
    this.updateData({
      watchedFilms: films.filter((film) => film.isWatched),
      dateFrom: date,
    });
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._currentPeriod);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _periodChangeHandler(evt) {
    const option = evt.target.value;
    evt.preventDefault();
    this._currentPeriod = option;

    switch (option) {
      case Period.ALL_TIME:
        this.updateData({dateFrom: null});
        break;
      case Period.TODAY:
        this.updateData({dateFrom: dayjs().startOf(`day`)});
        break;
      case Period.WEEK:
        this.updateData({dateFrom: dayjs(this.dateTo).subtract(1, `week`)});
        break;
      case Period.MONTH:
        this.updateData({dateFrom: dayjs(this.dateTo).subtract(1, `month`)});
        break;
      case Period.YEAR:
        this.updateData({dateFrom: dayjs(this.dateTo).subtract(1, `year`)});
        break;
    }
  }

  _setInnerHandlers() {
    const periodChooser = this.getElement().querySelectorAll(`.statistic__filters-input`);
    for (let chooser of periodChooser) {
      chooser.addEventListener(`change`, this._periodChangeHandler);
    }
  }


}
