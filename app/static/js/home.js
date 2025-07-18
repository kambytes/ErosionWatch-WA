/* Nav-bar dropdown menu button*/
document.getElementById('learn-toggle').addEventListener('click', function () {
  const dropdown = this.closest('.dropdown');
  dropdown.classList.toggle('open');
});

/* This is the function which provides functionality to gallery slideshow */
let index = 0;
const slides = document.querySelectorAll(".gallery");
const total = slides.length;
galleryMoveSlide(index);

function galleryMoveSlide(currentIndex) {
  slides.forEach(slide => slide.style.display = 'none');

  if (currentIndex >= total) {
    index = 0;
  } else if (currentIndex < 0) {
    index = total - 1;
  } else {
    index = currentIndex;
  }

  slides[index].style.display = "block";

  // Highlight the correct dot
  const dots = document.querySelectorAll(".dot");
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

function previousSlide() {
  galleryMoveSlide(index - 1); // move backward
}

function nextSlide() {
  galleryMoveSlide(index + 1); // move forward
}

function goToSlide(i) {
  galleryMoveSlide(i);
}