import AbstractView from "./abstract.js";
import {getRandomInteger} from "../utils/util.js";

const createStatisticsTemplate = () => {
  return `<p>${getRandomInteger(10000, 1000000)} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  getTemplate() {
    return createStatisticsTemplate();
  }
}
