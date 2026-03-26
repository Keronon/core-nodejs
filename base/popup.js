function showPopup(message) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  const popup = document.getElementById("popup");
  popup.innerHTML = "<p>" + message + "</p>";

  setTimeout(() => { closePopup(); }, 3000);
}

function closePopup() {
  document.getElementById("overlay").style.display = "none";
}

export default {
  showPopup,
  closePopup,
};
