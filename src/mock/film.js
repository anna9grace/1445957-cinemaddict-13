import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {getRandomInteger} from "../utils/util.js";
import {getRandomArrayElement} from "../utils/util.js";
dayjs.extend(duration);

const randomText = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `ras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const generateName = () => {
  const names = [
    `Made for Each Other`,
    `Popeye Meets Sinbad`,
    `Sagebrush Trail`,
    `Santa Claus Conquers the Martians`,
    `The Dance of Life`,
    `The Great Flamarion`,
    `The Man with the Golden Arm`,
  ];
  return getRandomArrayElement(names);
};

const generatePoster = () => {
  const posters = [
    `./images/posters/made-for-each-other.png`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/the-great-flamarion.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
  ];
  return getRandomArrayElement(posters);
};

const generateDirector = () => {
  const directors = [
    `Alfred Hitchcock`,
    `Federico Fellini`,
    `Jean-Luc Godard`,
    `Akira Kurosawa`,
    `Michelangelo Antonioni`,
    `Orson Welles`,
    `François Truffaut`,
  ];
  return getRandomArrayElement(directors);
};

const generateWriters = () => {
  const writers = [
    `Billy Wilder`,
    `Howard Hawks`,
    `Budd Schulberg`,
  ];
  return writers.slice(getRandomInteger(0, writers.length - 1));
};

const generateActors = () => {
  const actors = [
    `Marlon Brando`,
    `Rita Hayworth`,
    `James Stewart`,
    `Lana Turner`,
    `Humphrey Bogart`,
    `Veronica Lake`,
  ];
  return actors.slice(getRandomInteger(0, actors.length - 1));
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Germany`,
    `Italy`,
    `Sweden`,
    `France`,
  ];
  return getRandomArrayElement(countries);
};

const generateGenres = () => {
  const genres = [
    `Drama`,
    `Comedy`,
    `Mystery`,
    `Western`,
  ];
  return genres.slice(getRandomInteger(0, genres.length - 1));
};

const generateDescription = () => {
  let description = ``;
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    description += ` ${getRandomArrayElement(randomText)}`;
  }
  return description;
};

const generateComments = () => {
  const emojies = [`smile`, `sleeping`, `puke`, `angry`];
  const authors = [`John Doe`, `Tim Macoveev`, `Joe Black`, `John Smith`];
  const commentsNumber = getRandomInteger(0, 5);
  if (commentsNumber === 0) {
    return null;
  }
  return new Array(commentsNumber).fill().map(() => {
    return {
      text: getRandomArrayElement(randomText),
      emoji: getRandomArrayElement(emojies),
      author: getRandomArrayElement(authors),
      date: dayjs().subtract(getRandomInteger(0, 50000), `minutes`).toDate(),
    };
  });
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateFilm = () => {
  return {
    id: generateId(),
    name: generateName(),
    originalName: generateName(),
    poster: generatePoster(),
    rating: `${getRandomInteger(0, 9)}.${getRandomInteger(0, 9)}`,
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    releaseDate: dayjs().subtract(getRandomInteger(10000, 30000), `day`).toDate(),
    duration: dayjs.duration(getRandomInteger(30, 180), `minutes`),
    country: generateCountry(),
    genres: generateGenres(),
    description: generateDescription(),
    comments: generateComments(),
    isInWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    ageRating: `${0 + 2 * getRandomInteger(0, 9)}+`,
    newEmoji: null,
    newCommentText: ``,
  };
};
