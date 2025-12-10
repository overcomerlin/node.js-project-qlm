const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const date = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

export default {
  year: year,
  month: month,
  date: date,
  hours: hours,
  minutes: minutes,
  seconds: seconds,
  remarkTimestamp:
    year +
    "-" +
    month +
    "-" +
    date +
    "_" +
    hours +
    "-" +
    minutes +
    "-" +
    seconds,
};
