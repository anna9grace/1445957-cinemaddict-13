import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {getRandomInteger, getRandomArrayElement} from "../utils/util.js";
import {authors} from "../utils/constants.js";
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

export const generateComments = (commentId) => {
  const emojies = [`smile`, `sleeping`, `puke`, `angry`];
  return {
    id: commentId,
    text: getRandomArrayElement(randomText),
    emoji: getRandomArrayElement(emojies),
    author: getRandomArrayElement(authors),
    date: dayjs().subtract(getRandomInteger(0, 50000), `minutes`).toDate(),
  };
};

