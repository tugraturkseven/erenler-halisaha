import { addDays, getDay, format, parse } from "date-fns";

export const getNextSameDayDate = (date) => {
  const formattedDate = parse(date, "dd.MM.yyyy", new Date());
  const dayOfWeek = getDay(formattedDate);
  let currentDate = addDays(formattedDate, 0); // Start from the next day
  const days = [];
  while (days.length < 4) {
    if (getDay(currentDate) === dayOfWeek) {
      days.push(format(currentDate, "dd.MM.yyyy"));
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};
