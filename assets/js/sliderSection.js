const track = document.querySelector(".slider-track");
const allCards = Array.from(document.querySelectorAll(".slider-card"));
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
const step = 4;
const visible = 6;
const total = allCards.length;

function updateSlider() {
  const cardWidth = allCards[0].offsetWidth + 20; // 20 là khoảng cách gap
  const maxIndex = Math.ceil(total / step) - 1;

  // Nếu đang ở cuối và next thì reset về 0
  if (currentIndex > maxIndex) {
    currentIndex = 0;
  }

  const offset = currentIndex * step * cardWidth;
  track.style.transform = `translateX(-${offset}px)`;

  // Fade card đầu và cuối
  allCards.forEach((card, idx) => {
    card.classList.remove("fade");
    const start = currentIndex * step;
    if (idx === start || idx === start + visible - 1) {
      card.classList.add("fade");
    }
  });

  // Cập nhật dot
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
  });
}

btnNext.addEventListener("click", () => {
  currentIndex++;
  updateSlider();
});

btnPrev.addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + Math.ceil(total / step)) % Math.ceil(total / step);
  updateSlider();
});

// Initial
updateSlider();
