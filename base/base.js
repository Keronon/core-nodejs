import popup from './popup.js';

function icyfy(obj) {
  return Object.freeze(obj);
}

function randInt(min, max) {
  if (!max) { max = min; min = 0; }
  return Math.floor(Math.random() * (max - min)) + min;
}

function openLink(link) {
  // Добавляем текущий домен, если относительный URL
  const fullUrl = link.startsWith("http")
    ? link
    : window.location.origin + "/" + link.replace(/^\//, "");

  // HEAD-запрос для проверки существования
  fetch(fullUrl, { method: "HEAD" })
    .then((response) => {
      if (response.ok) { // 200-299, страница существует
        window.location.href = fullUrl; // Переход
      } else {
        // 404 или другая ошибка
        const err = `${fullUrl}<br/>Страница не существует!<br/>Статус: ${response.status}`;
        log(err);
        popup.showPopup(err);
      }
    })
    .catch((error) => {
      // Сетевая ошибка или CORS
      const err = `Ошибка проверки: ${error.message}`;
      log(err);
      popup.showPopup(err);
    });
}

export default {
  icyfy,
  randInt,
  openLink,
  popup
}
