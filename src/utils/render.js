import Abstract from "../view/abstract";

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const render = (container, place, element) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const replace = (newElement, oldElement) => {
  if (newElement instanceof Abstract) {
    newElement = newElement.getElement();
  }
  if (oldElement instanceof Abstract) {
    oldElement = oldElement.getElement();
  }
  const parent = oldElement.parentElement;

  if (parent === null || newElement === null || oldElement === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newElement, oldElement);
};

export const removeElement = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};

export const getContainer = (element) => {
  return element.getElement().querySelector(`.films-list__container`);
};

export const changePageOverflow = () => {
  document.querySelector(`body`).classList.toggle(`hide-overflow`);
};
