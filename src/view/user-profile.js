import Abstract from "./abstract.js";
import {getProfileRank} from "../utils/statistics.js";


const createUserProfileTemplate = (films) => {
  const rank = getProfileRank(films);

  return `<section class="header__profile profile">
      ${rank ? `<p class="profile__rating">${rank}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};


export default class UserProfile extends Abstract {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }
}
