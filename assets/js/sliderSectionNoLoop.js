function initSlider(sliderContainer) {
  const track = sliderContainer.querySelector(".slider-track");
  const allCards = Array.from(sliderContainer.querySelectorAll(".slider-card"));
  const btnNext = sliderContainer.querySelector(".slider-btn.next");
  const btnPrev = sliderContainer.querySelector(".slider-btn.prev");
  const sliderWindow = sliderContainer.querySelector(".slider-window");
  const dotContainer = sliderContainer.querySelector(".slider-dots");
  const expertSection = document.querySelector(".expert-section");
  const isNewsSection = sliderContainer.closest(".news-section");

  const total = allCards.length;
  const gap = 20;
  let responsiveVisible = 4;
  let cardWidth;
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let dots = [];

  const getResponsiveVisible = () => {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1200) return 3;
    return isNewsSection ? 3 : 4;
  };

  const calculateCardWidth = () => {
    const trackWidth = sliderWindow.offsetWidth;
    return (trackWidth * 0.79 - gap * responsiveVisible) / responsiveVisible;
  };

  const updateButtonVisibility = () => {
    if (btnPrev) btnPrev.style.display = currentIndex === 0 ? "none" : "block";
    if (btnNext)
      btnNext.style.display =
        currentIndex >= total - responsiveVisible ? "none" : "block";

    const offset = Math.max(30, Math.min(sliderWindow.offsetWidth * 0.1, 200));
    if (btnPrev) btnPrev.style.left = `${offset}px`;
    if (btnNext) btnNext.style.right = `${offset}px`;
  };

  const updateSlider = (animate = true) => {
    const offset = -(currentIndex * (cardWidth + gap));
    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${offset}px)`;

    updateButtonVisibility();

    // Fade logic (skip for news-section)
    allCards.forEach((card) => card.classList.remove("fade"));
    if (!isNewsSection) {
      const before = currentIndex - 1;
      const after = currentIndex + responsiveVisible;
      if (before >= 0) allCards[before]?.classList.add("fade");
      if (after < total) allCards[after]?.classList.add("fade");
    }

    // Active dot
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex)
    );
  };

  const buildDots = () => {
    if (!dotContainer) return;
    dotContainer.innerHTML = "";

    const count = total - responsiveVisible + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = `dot${i === 0 ? " active" : ""}`;
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
      });
      dotContainer.appendChild(dot);
    }
    dots = dotContainer.querySelectorAll(".dot");
  };

  const recalculate = () => {
    responsiveVisible = getResponsiveVisible();
    cardWidth = calculateCardWidth();

    allCards.forEach((card) => {
      card.style.width = `${cardWidth}px`;
      card.style.flex = "0 0 auto";
    });

    // Layout tweaks
    if (isNewsSection) {
      sliderWindow.style.left = "0";
    } else {
      const halfCard =
        (cardWidth + gap + cardWidth / (12 - responsiveVisible)) / 2;
      sliderWindow.style.left = `${halfCard}px`;
      if (expertSection) expertSection.style.padding = `0px ${halfCard + 60}px`;
    }

    buildDots();
    updateSlider(false);
  };

  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

  const touchStart = (e) => {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = "none";
  };

  const touchMove = (e) => {
    if (!isDragging) return;
    const movedBy = getPositionX(e) - startX;

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
  };

  const touchEnd = () => {
    if (isDragging) {
      isDragging = false;
      updateSlider();
    }
  };

  const addSwipeEvents = () => {
    track.addEventListener("touchstart", touchStart);
    track.addEventListener("touchmove", touchMove);
    track.addEventListener("touchend", touchEnd);

    track.addEventListener("mousedown", touchStart);
    track.addEventListener("mousemove", touchMove);
    track.addEventListener("mouseup", touchEnd);
    track.addEventListener("mouseleave", touchEnd);
  };

  const addEventListeners = () => {
    btnNext?.addEventListener("click", () => {
      if (currentIndex < total - responsiveVisible) {
        currentIndex++;
        updateSlider();
      }
    });

    btnPrev?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    window.addEventListener("resize", recalculate);
    addSwipeEvents();
  };

  // Initialize
  recalculate();
  addEventListeners();
}

document.querySelectorAll(".slider").forEach((slider) => {
  initSlider(slider);
});
