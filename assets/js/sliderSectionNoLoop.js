const track = document.querySelector(".slider-track");
const allCards = Array.from(document.querySelectorAll(".slider-card"));
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");
const sliderWindow = document.querySelector(".slider-window");

const total = allCards.length;
const gap = 20;
let responsiveVisible = 4;
let cardWidth;
let currentIndex = 0;
let isDragging = false;
let startX = 0;

function calculateCardWidth() {
  const trackWidth = sliderWindow.offsetWidth;
  cardWidth = (trackWidth * 0.79 - gap * responsiveVisible) / responsiveVisible;
}

function updateButtonVisibility() {
  if (btnPrev) btnPrev.style.display = currentIndex === 0 ? "none" : "block";
  if (btnNext)
    btnNext.style.display =
      currentIndex >= total - responsiveVisible ? "none" : "block";

  const sliderWidth = sliderWindow.offsetWidth;
  const offset = Math.max(30, Math.min(sliderWidth * 0.1, 200));
  btnPrev.style.left = `${offset}px`;
  btnNext.style.right = `${offset}px`;
}

function updateSlider(animate = true) {
  const offset = -(currentIndex * (cardWidth + gap));
  track.style.transition = animate ? "transform 0.5s ease" : "none";
  track.style.transform = `translateX(${offset}px)`;

  updateButtonVisibility();

  // Xóa fade hiện tại
  allCards.forEach((card) => card.classList.remove("fade"));

  const visibleRangeStart = currentIndex - 1;
  const visibleRangeEnd = currentIndex + responsiveVisible;

  // Nếu không phải đang ở phần tử đầu tiên thì mới fade đầu
  if (currentIndex > 0 && allCards[visibleRangeStart])
    allCards[visibleRangeStart].classList.add("fade");

  // Nếu không phải đang ở phần tử cuối cùng thì mới fade cuối
  if (currentIndex < total - responsiveVisible && allCards[visibleRangeEnd])
    allCards[visibleRangeEnd].classList.add("fade");
}

function recalculate() {
  const trackWidth = sliderWindow.offsetWidth;

  if (window.innerWidth <= 576) {
    responsiveVisible = 1;
  } else if (window.innerWidth <= 768) {
    responsiveVisible = 2;
  } else if (window.innerWidth <= 1200) {
    responsiveVisible = 3;
  } else {
    responsiveVisible = 4;
  }

  cardWidth = (trackWidth * 0.79 - gap * responsiveVisible) / responsiveVisible;

  allCards.forEach((card) => {
    card.style.width = `${cardWidth}px`;
  });

  const halfCard = cardWidth / 2;
  sliderWindow.style.left = `${halfCard}px`;

  updateSlider(false);
}

function initializeSlider() {
  calculateCardWidth();
  recalculate();
  allCards.forEach((card) => {
    card.style.flex = "0 0 auto";
    card.style.width = `${cardWidth}px`;
  });

  updateSlider(false);
  addEventListeners();
}

function addEventListeners() {
  if (btnNext)
    btnNext.addEventListener("click", () => {
      if (currentIndex < total - responsiveVisible) {
        currentIndex++;
        updateSlider();
      }
    });

  if (btnPrev)
    btnPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

  window.addEventListener("resize", recalculate);
  addSwipeEvents();
}

function addSwipeEvents() {
  track.addEventListener("touchstart", touchStart);
  track.addEventListener("touchmove", touchMove);
  track.addEventListener("touchend", touchEnd);

  track.addEventListener("mousedown", touchStart);
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd();
  });
}

function touchStart(e) {
  isDragging = true;
  startX = getPositionX(e);
  track.style.transition = "none";
}

function touchMove(e) {
  if (!isDragging) return;
  const currentX = getPositionX(e);
  const movedBy = currentX - startX;

  if (movedBy < -50 && currentIndex < total - responsiveVisible) {
    isDragging = false;
    currentIndex++;
    updateSlider();
  } else if (movedBy > 50 && currentIndex > 0) {
    isDragging = false;
    currentIndex--;
    updateSlider();
  } else {
    track.style.transform = `translateX(${
      -(currentIndex * (cardWidth + gap)) + movedBy
    }px)`;
  }
}

function touchEnd() {
  if (!isDragging) return;
  isDragging = false;
  updateSlider();
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

// Bắt đầu
initializeSlider();
