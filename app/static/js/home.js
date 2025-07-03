/* Nav-bar dropdown menu button*/
document.getElementById('learn-toggle').addEventListener('click', function () {
  const dropdown = this.closest('.dropdown');
  dropdown.classList.toggle('open');
});

