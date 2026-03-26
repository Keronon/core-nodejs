import popup from './popup.js';
const log = console.log;

function icyfy(obj) {
  return Object.freeze(obj);
}

function randInt(min, max) {
  if (!max) { max = min; min = 0; }
  return Math.floor(Math.random() * (max - min)) + min;
}

function openLink(link) {
  fetch(link, { method: "HEAD" })
    .then((response) => {
      if (response.ok) { // 200-299, страница существует
        window.location.href = link; // Переход
      } else {
        // 404 или другая ошибка
        const err = `${link}<br/>Переход не возможен<br/>Статус: ${response.status}`;
        log(err.replace('<br/>', '\n'));
        popup.showPopup(err);
      }
    })
    .catch((error) => {
      // Сетевая ошибка, опечатка адреса, CORS
      const err = `${link}<br/>Ошибка проверки ссылки<br/>Ошибка: ${error.message}`;
      log(err.replace('<br/>', '\n'));
      popup.showPopup(err);
    });
}

export default {
  icyfy,
  randInt,
  openLink,
  popup
}
