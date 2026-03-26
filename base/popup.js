function showPopup(message) {
  $('div#overlay').css('display', 'block');
  $('div#popup').html(`<p>${message}</p>`);

  setTimeout(() => { closePopup(); }, 3000);
}

function closePopup() {
  $('div#overlay').css('display', 'none');
}

export default {
  showPopup,
  closePopup,
};
