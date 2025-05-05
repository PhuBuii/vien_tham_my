function initSlider(sliderContainer) {
  const track = sliderContainer.querySelector(".slider-track");
  const allCards = Array.from(sliderContainer.querySelectorAll(".slider-card"));
  const btnNext = sliderContainer.querySelector(".slider-btn.next");
  const btnPrev = sliderContainer.querySelector(".slider-btn.prev");
  const sliderWindow = sliderContainer.querySelector(".slider-window");
  const dotContainer = sliderContainer.querySelector(".slider-dots");

  const total = allCards.length;
  const gap = 20;
  let responsiveVisible = 4;
  let cardWidth;
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let dots = [];

  function calculateCardWidth() {
    const trackWidth = sliderWindow.offsetWidth;
    cardWidth =
      (trackWidth * 0.79 - gap * responsiveVisible) / responsiveVisible;
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

    allCards.forEach((card) => card.classList.remove("fade"));

    const visibleRangeStart = currentIndex - 1;
    const visibleRangeEnd = currentIndex + responsiveVisible;

    if (currentIndex > 0 && allCards[visibleRangeStart])
      allCards[visibleRangeStart].classList.add("fade");

    if (currentIndex < total - responsiveVisible && allCards[visibleRangeEnd])
      allCards[visibleRangeEnd].classList.add("fade");

    // Update dots active state
    if (dots.length) {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }
  }

  function buildDots() {
    if (!dotContainer) return;

    dotContainer.innerHTML = "";
    const dotCount = total - responsiveVisible + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
      });

      dotContainer.appendChild(dot);
    }

    dots = dotContainer.querySelectorAll(".dot");
  }

  function recalculate() {
    const trackWidth = sliderWindow.offsetWidth;

    responsiveVisible =
      window.innerWidth <= 576
        ? 1
        : window.innerWidth <= 768
        ? 2
        : window.innerWidth <= 1200
        ? 3
        : 4;

    cardWidth =
      (trackWidth * 0.79 - gap * responsiveVisible) / responsiveVisible;

    allCards.forEach((card) => {
      card.style.width = `${cardWidth}px`;
    });

    const halfCard = cardWidth / 2;
    sliderWindow.style.left = `${halfCard}px`;

    buildDots();
    updateSlider(false);
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

  initializeSlider();
}

document.querySelectorAll(".slider").forEach((slider) => {
  initSlider(slider);
});
