const ProfileMinFilmsWatched = {
  "1": `Novice`,
  "11": `Fan`,
  "21": `Movie Buff`,
};

const createProfileRatingTemplate = (films) => {
  const watchedFilmsCount = films.filter((film) => film.isWatched).length;
  let profileRating = null;

  Object.entries(ProfileMinFilmsWatched).forEach(([minCount, name]) => {
    if (watchedFilmsCount >= +minCount) {
      profileRating = name;
    }
  });

  return profileRating ? `<p class="profile__rating">${profileRating}</p>` : ``;
};

export const createUserProfileTemplate = (films) => {
  return `<section class="header__profile profile">
      ${createProfileRatingTemplate(films)}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};
