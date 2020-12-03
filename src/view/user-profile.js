import AbstractView from "./abstract.js";

const RankMinFilmsWatched = {
  "1": `Novice`,
  "11": `Fan`,
  "21": `Movie Buff`,
};

const createProfileRankTemplate = (watchedFilms) => {
  let profileRank = null;

  Object.entries(RankMinFilmsWatched).forEach(([minCount, rank]) => {
    if (watchedFilms >= +minCount) {
      profileRank = rank;
    }
  });
  return profileRank ? `<p class="profile__rating">${profileRank}</p>` : ``;
};

const createUserProfileTemplate = (films) => {
  return `<section class="header__profile profile">
      ${createProfileRankTemplate(films)}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class UserProfile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }
}
