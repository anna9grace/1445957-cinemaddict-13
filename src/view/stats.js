import {getRandomInteger} from "../util.js";

export const createStatisticsTemplate = () => {
  return `<p>${getRandomInteger(10000, 1000000)} movies inside</p>`;
};
