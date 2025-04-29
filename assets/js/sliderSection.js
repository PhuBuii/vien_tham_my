const track = document.querySelector(".slider-track");
const allCards = Array.from(document.querySelectorAll(".slider-card"));
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");
const dotContainer = document.querySelector(".slider-dots");
const sliderWindow = document.querySelector(".slider-window");

const total = allCards.length;
const gap = 20;
let responsiveVisible = 4;
let step = 1;
let totalSlots = responsiveVisible;
let cardWidth;
let currentIndex = responsiveVisible;
let updatedCards = [];
let dots = [];
let autoplayInterval;

let isDragging = false;
let startX = 0;
let autoplayDelay = 4000; // 4 giây

// Tính width mỗi card
function calculateCardWidth() {
  const trackWidth = sliderWindow.offsetWidth;
  cardWidth = (trackWidth * 0.79 - gap * totalSlots) / totalSlots;
}

// Điều chỉnh vị trí nút Prev/Next theo sliderWindow
function adjustButtonPositions() {
  const sliderWindowWidth = sliderWindow.offsetWidth;
  let offset = sliderWindowWidth * 0.1;
  offset = Math.max(30, Math.min(offset, 200));
  if (btnPrev) btnPrev.style.left = `${offset}px`;
  if (btnNext) btnNext.style.right = `${offset}px`;
}

// Khởi tạo slider
function initializeSlider() {
  calculateCardWidth();
  adjustButtonPositions();

  if (total <= responsiveVisible) {
    if (btnNext) btnNext.style.display = "none";
    if (btnPrev) btnPrev.style.display = "none";
    dotContainer.style.display = "none";
    allCards.forEach((card) => {
      card.style.flex = `0 0 auto`;
      card.style.width = `${cardWidth}px`;
    });
  } else {
    for (let i = 0; i < responsiveVisible; i++) {
      const cloneFirst = allCards[i].cloneNode(true);
      track.appendChild(cloneFirst);
      const cloneLast = allCards[total - 1 - i].cloneNode(true);
      track.prepend(cloneLast);
    }

    updatedCards = Array.from(document.querySelectorAll(".slider-card"));

    updatedCards.forEach((card) => {
      card.style.flex = `0 0 auto`;
      card.style.width = `${cardWidth}px`;
    });

    buildDots();
    addEventListeners();
    currentIndex = responsiveVisible;
    updateSlider(false);
    recalculate();
    startAutoplay();
  }
}

function buildDots() {
  dotContainer.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotContainer.appendChild(dot);
  }
  dots = document.querySelectorAll(".dot");
}

function updateSlider(animate = true) {
  const offset = -(currentIndex * (cardWidth + gap));
  track.style.transition = animate ? "transform 0.5s ease" : "none";
  track.style.transform = `translateX(${offset}px)`;

  updatedCards.forEach((card) => card.classList.remove("fade"));
  updatedCards.forEach((card, idx) => {
    if (idx === currentIndex - 1 && responsiveVisible > 1) {
      card.classList.add("fade");
    }
    if (idx === currentIndex + responsiveVisible && responsiveVisible > 2) {
      card.classList.add("fade");
    }
  });

  const centerIndex = (currentIndex - responsiveVisible + total) % total;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === centerIndex);
  });
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

  totalSlots = responsiveVisible;
  cardWidth = (trackWidth * 0.79 - gap * totalSlots) / totalSlots;

  updatedCards.forEach((card) => {
    card.style.width = `${cardWidth}px`;
  });

  const halfCard = (cardWidth + gap + cardWidth / (12 - responsiveVisible)) / 2;
  sliderWindow.style.left = `${halfCard}px`;

  adjustButtonPositions();
  updateSlider(false);
}

function addEventListeners() {
  if (btnNext)
    btnNext.addEventListener("click", () => {
      currentIndex++;
      updateSlider();
      startAutoplay();
    });

  if (btnPrev)
    btnPrev.addEventListener("click", () => {
      currentIndex--;
      updateSlider();
      startAutoplay();
    });

  track.addEventListener("transitionend", () => {
    if (currentIndex >= total + responsiveVisible) {
      track.style.transition = "none";
      currentIndex = responsiveVisible;
      updateSlider(false);
      track.offsetHeight;
    }
    if (currentIndex < responsiveVisible) {
      track.style.transition = "none";
      currentIndex = total + responsiveVisible - 1;
      updateSlider(false);
      track.offsetHeight;
    }
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx + responsiveVisible;
      updateSlider();
      startAutoplay();
    });
  });

  window.addEventListener("resize", recalculate);

  addSwipeEvents();
}

// --- TOUCH + SWIPE ---
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

  // Nếu kéo đủ 1 lần => move luôn 1 card rồi khóa kéo
  if (movedBy < -50) {
    isDragging = false;
    currentIndex++;
    updateSlider();
    startAutoplay();
  } else if (movedBy > 50) {
    isDragging = false;
    currentIndex--;
    updateSlider();
    startAutoplay();
  } else {
    // Nếu chưa đủ 50px thì chỉ kéo nhẹ theo ngón tay
    track.style.transform = `translateX(${
      -(currentIndex * (cardWidth + gap)) + movedBy
    }px)`;
  }
}

function touchEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  updateSlider(); // Nếu kéo chưa tới ngưỡng thì về lại vị trí cũ
  startAutoplay();
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

// Khởi động
initializeSlider();
