const track = document.querySelector(".slider-track");
const allCards = Array.from(document.querySelectorAll(".slider-card"));
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");
const dotContainer = document.querySelector(".slider-dots");

const total = allCards.length;
const step = 4;
const visible = 6;
let currentIndex = 0;

const dotCount = Math.ceil(total / step);
dotContainer.innerHTML = "";
for (let i = 0; i < dotCount; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dotContainer.appendChild(dot);
}
let dots = document.querySelectorAll(".dot");

function getVisibleIndices(index) {
  const result = [];
  for (let i = -1; i <= step; i++) {
    let idx = (index * step + i + total) % total;
    result.push(idx);
  }
  return result;
}

function updateSlider() {
  const cardWidth = allCards[0].offsetWidth + 20;
  const startIdx = (currentIndex * step - 1 + total) % total;
  const offset = -startIdx * cardWidth;

  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(${offset}px)`;

  const visibleIndices = getVisibleIndices(currentIndex);
  const cloned = visibleIndices.map((i) => allCards[i]);

  track.innerHTML = "";
  cloned.forEach((card, idx) => {
    const clone = card.cloneNode(true);
    if (idx === 0 || idx === visible - 1) {
      clone.classList.add("fade");
    } else {
      clone.classList.remove("fade");
    }
    track.appendChild(clone);
  });

  track.style.transform = `translateX(-50px)`;

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex % dotCount);
  });
}

btnNext.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % dotCount;
  updateSlider();
});

btnPrev.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + dotCount) % dotCount;
  updateSlider();
});

updateSlider();
