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

// Tính width mỗi card
function calculateCardWidth() {
  const trackWidth = sliderWindow.offsetWidth;
  cardWidth = (trackWidth * 0.79 - gap * totalSlots) / totalSlots;
}

// Điều chỉnh vị trí nút Prev/Next theo sliderWindow
function adjustButtonPositions() {
  const sliderWindowWidth = sliderWindow.offsetWidth;
  let offset = sliderWindowWidth * 0.1; // 8%
  offset = Math.max(30, Math.min(offset, 200)); // Min 30px, Max 200px

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
    updateSlider(false);
    recalculate();
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
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(${offset}px)`;

  updatedCards.forEach((card) => card.classList.remove("fade"));
  for (let i = 0; i < updatedCards.length; i++) {
    if (i === currentIndex - 1 && responsiveVisible > 1) {
      updatedCards[i].classList.add("fade");
    }
    if (i === currentIndex + responsiveVisible && responsiveVisible > 2) {
      updatedCards[i].classList.add("fade");
    }
  }

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

      if (currentIndex > updatedCards.length - responsiveVisible) {
        // Clone thêm từ đầu
        for (let i = 0; i < responsiveVisible; i++) {
          const clone = updatedCards[i].cloneNode(true);
          track.appendChild(clone);
        }

        // 🛠️ Cleanup bớt đầu
        for (let i = 0; i < responsiveVisible; i++) {
          track.removeChild(track.firstElementChild);
          currentIndex--; // Vì đã mất bớt 1 card ở đầu nên currentIndex giảm
        }

        updatedCards = Array.from(document.querySelectorAll(".slider-card"));
      }

      track.style.transition = "transform 0.5s ease";
      updateSlider();
    });

  if (btnPrev)
    btnPrev.addEventListener("click", () => {
      currentIndex--;

      if (currentIndex < 0) {
        for (let i = 0; i < responsiveVisible; i++) {
          const clone =
            updatedCards[updatedCards.length - 1 - i].cloneNode(true);
          track.prepend(clone);
        }

        updatedCards = Array.from(document.querySelectorAll(".slider-card"));

        currentIndex += responsiveVisible;

        for (let i = 0; i < responsiveVisible; i++) {
          track.removeChild(track.lastElementChild);
        }
      }

      track.style.transition = "transform 0.5s ease";
      updateSlider();
    });

  track.addEventListener("transitionend", () => {
    if (currentIndex >= total + responsiveVisible) {
      track.style.transition = "none";
      currentIndex = responsiveVisible;
      track.offsetHeight;
      updateSlider(false);
    } else if (currentIndex <= 0) {
      track.style.transition = "none";
      currentIndex = total;
      track.offsetHeight;
      updateSlider(false);
    }
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx + responsiveVisible;
      updateSlider();
    });
  });

  window.addEventListener("resize", recalculate);
}

initializeSlider();
