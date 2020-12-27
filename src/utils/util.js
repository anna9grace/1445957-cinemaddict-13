import dayjs from "dayjs";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};

export const humanizeDuration = (duration) => {
  let durationInHours = duration.get(`hours`) !== 0 ? duration.get(`hours`) + `h ` : ``;
  return `${durationInHours}${duration.get(`minutes`)}m`;
};

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }
  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};
