const formatLessThanTen = n => n < 10 ? '0' + n : n;

const formatDate = date => {
  return `${formatLessThanTen(date.getDate())}/${formatLessThanTen(date.getMonth() + 1)}/${formatLessThanTen(date.getFullYear())}`;
}

const formatTime = time => {
  return `${formatLessThanTen(time.getHours())}:${formatLessThanTen(time.getMinutes())}:${formatLessThanTen(time.getSeconds())}`;
};