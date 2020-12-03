import AbstractView from "./abstract.js";

const createFilmsSectionTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsBlock extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
