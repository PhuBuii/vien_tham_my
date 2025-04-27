const track = document.querySelector(".slider-track");
const allCards = Array.from(document.querySelectorAll(".slider-card"));
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");
const dotContainer = document.querySelector(".slider-dots");

const total = allCards.length;
const visible = 6;
const step = 1; // chỉ nhảy 1 hình
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
const gap = 20; // giống như gap bạn set trong .slider-track

function updateSlider() {
  const trackWidth = track.offsetWidth;
  const cardWidth = (trackWidth - gap * (visible - 1)) / visible;

  const offset = -(currentIndex * (cardWidth + gap));

  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(${offset}px)`;

  // Reset toàn bộ card opacity trước
  allCards.forEach((card) => card.classList.remove("fade"));

  // Fade card đầu tiên và card cuối cùng trong visible range
  const fadeFirstIdx = (currentIndex + total) % total;
  const fadeLastIdx = (currentIndex + visible - 1) % total;

  allCards.forEach((card, idx) => {
    if (idx === fadeFirstIdx || idx === fadeLastIdx) {
      card.classList.add("fade");
    }
  });

  // Update dots
  dots.forEach((dot, idx) => {
    dot.classList.toggle(
      "active",
      idx === Math.floor(currentIndex / step) % dotCount
    );
  });
}

btnNext.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % (total + 1 - visible);
  updateSlider();
});

btnPrev.addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + (total + 1 - visible)) % (total + 1 - visible);
  updateSlider();
});

// Initial load
updateSlider();
