class CustomSlider {
  constructor(sliderContainer, options = {}) {
    this.container = sliderContainer;
    this.track = this.container.querySelector(".slider-track");
    this.cards = Array.from(this.container.querySelectorAll(".slider-card"));
    this.btnNext = this.container.querySelector(".slider-btn.next");
    this.btnPrev = this.container.querySelector(".slider-btn.prev");
    this.dotContainer = this.container.querySelector(".slider-dots");
    this.sliderWindow = this.container.querySelector(".slider-window");

    this.isNewsSection = this.container.closest(".news-section");
    this.expertSection = document.querySelector(".expert-section");

    this.loop = options.loop ?? false;
    this.autoplay = options.autoplay ?? false;
    this.autoplayDelay = options.autoplayDelay ?? 4000;
    this.gap = options.gap ?? 20;

    this.total = this.cards.length;
    this.responsiveVisible = 4;
    this.totalSlots = 4;
    this.cardWidth = 0;
    this.currentIndex = 0;
    this.dots = [];
    this.updatedCards = [];
    this.autoplayInterval = null;

    this.isDragging = false;
    this.startX = 0;

    this.initialize();
  }

  initialize() {
    this.calculateResponsive();
    this.cardWidth = this.calculateCardWidth();

    if (this.loop && this.total > this.responsiveVisible) {
      this.addLoopClones();
      this.currentIndex = this.responsiveVisible;
      this.updatedCards = Array.from(
        this.container.querySelectorAll(".slider-card")
      );
    } else {
      this.updatedCards = this.cards;
    }

    this.setCardWidths();
    this.adjustLayout();
    this.buildDots();
    this.updateSlider(false);
    this.addEventListeners();

    if (this.loop && this.autoplay) this.startAutoplay();
  }

  calculateResponsive() {
    const w = window.innerWidth;
    if (this.isNewsSection) {
      if (w <= 768) this.responsiveVisible = 1;
      else if (w <= 1200) this.responsiveVisible = 2;
      else this.responsiveVisible = 3;
    } else {
      if (w <= 576) this.responsiveVisible = 1;
      else if (w <= 768) this.responsiveVisible = 2;
      else if (w <= 1200) this.responsiveVisible = 3;
      else this.responsiveVisible = 4;
    }
    this.totalSlots = this.responsiveVisible;
  }

  calculateCardWidth() {
    const trackWidth = this.sliderWindow.offsetWidth;
    return (trackWidth * 0.79 - this.gap * this.totalSlots) / this.totalSlots;
  }

  addLoopClones() {
    for (let i = 0; i < this.responsiveVisible; i++) {
      const cloneFirst = this.cards[i].cloneNode(true);
      const cloneLast = this.cards[this.total - 1 - i].cloneNode(true);
      this.track.appendChild(cloneFirst);
      this.track.prepend(cloneLast);
    }
  }

  setCardWidths() {
    this.updatedCards.forEach((card) => {
      card.style.flex = "0 0 auto";
      card.style.width = `${this.cardWidth}px`;
    });
  }

  adjustLayout() {
    if (this.isNewsSection) {
      this.sliderWindow.style.left = "0";
    } else {
      const halfCard =
        (this.cardWidth +
          this.gap +
          this.cardWidth / (12 - this.responsiveVisible)) /
        2;
      this.sliderWindow.style.left = `${halfCard}px`;
      if (this.expertSection) {
        this.expertSection.style.padding = `0px ${halfCard + 60}px`;
      }
    }
    this.adjustButtonPositions();
  }

  adjustButtonPositions() {
    const offset = Math.max(
      30,
      Math.min(this.sliderWindow.offsetWidth * 0.1, 200)
    );
    if (this.btnPrev) this.btnPrev.style.left = `${offset}px`;
    if (this.btnNext) this.btnNext.style.right = `${offset}px`;
  }

  buildDots() {
    if (!this.dotContainer) return;
    this.dotContainer.innerHTML = "";

    const dotCount = this.loop
      ? this.total
      : this.total - this.responsiveVisible + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      dot.className = `dot${i === 0 ? " active" : ""}`;
      dot.addEventListener("click", () => {
        this.currentIndex = this.loop ? i + this.responsiveVisible : i;
        this.updateSlider();
        this.startAutoplay();
      });
      this.dotContainer.appendChild(dot);
    }

    this.dots = this.dotContainer.querySelectorAll(".dot");
  }

  updateSlider(animate = true) {
    const offset = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = animate ? "transform 0.5s ease" : "none";
    this.track.style.transform = `translateX(${offset}px)`;
    if (!this.isNewsSection) {
      this.updatedCards.forEach((card) => card.classList.remove("fade"));
      if (this.currentIndex - 1 >= 0)
        this.updatedCards[this.currentIndex - 1]?.classList.add("fade");
      if (this.currentIndex + this.responsiveVisible < this.updatedCards.length)
        this.updatedCards[
          this.currentIndex + this.responsiveVisible
        ]?.classList.add("fade");
    }
    const dotIndex = this.loop
      ? (this.currentIndex - this.responsiveVisible + this.total) % this.total
      : this.currentIndex;
    this.dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === dotIndex)
    );

    // Ẩn nút nếu không loop
    if (!this.loop) {
      const atStart = this.currentIndex === 0;
      const atEnd = this.currentIndex >= this.total - this.responsiveVisible;
      if (this.btnPrev) this.btnPrev.style.display = atStart ? "none" : "block";
      if (this.btnNext) this.btnNext.style.display = atEnd ? "none" : "block";
    }
  }

  addEventListeners() {
    this.btnNext?.addEventListener("click", () => {
      if (
        !this.loop &&
        this.currentIndex >= this.total - this.responsiveVisible
      )
        return;
      this.currentIndex++;
      this.updateSlider();
      this.startAutoplay();
    });

    this.btnPrev?.addEventListener("click", () => {
      if (!this.loop && this.currentIndex <= 0) return;
      this.currentIndex--;
      this.updateSlider();
      this.startAutoplay();
    });

    this.track.addEventListener("transitionend", () => {
      if (this.loop) {
        if (this.currentIndex >= this.total + this.responsiveVisible) {
          this.track.style.transition = "none";
          this.currentIndex = this.responsiveVisible;
          this.updateSlider(false);
        } else if (this.currentIndex < this.responsiveVisible) {
          this.track.style.transition = "none";
          this.currentIndex = this.total + this.responsiveVisible - 1;
          this.updateSlider(false);
        }
      }
    });

    window.addEventListener("resize", () => {
      this.recalculate();
    });

    this.addSwipeEvents();
  }

  addSwipeEvents() {
    this.track.addEventListener("touchstart", (e) => this.touchStart(e));
    this.track.addEventListener("touchmove", (e) => this.touchMove(e));
    this.track.addEventListener("touchend", (e) => this.touchEnd(e));

    this.track.addEventListener("mousedown", (e) => this.touchStart(e));
    this.track.addEventListener("mousemove", (e) => this.touchMove(e));
    this.track.addEventListener("mouseup", (e) => this.touchEnd(e));
    this.track.addEventListener("mouseleave", (e) => {
      if (this.isDragging) this.touchEnd(e);
    });
  }

  getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  touchStart(e) {
    this.isDragging = true;
    this.startX = this.getPositionX(e);
    this.track.style.transition = "none";
  }

  touchMove(e) {
    if (!this.isDragging) return;
    const movedBy = this.getPositionX(e) - this.startX;

    if (movedBy < -50) {
      if (
        !this.loop &&
        this.currentIndex >= this.total - this.responsiveVisible
      )
        return;
      this.isDragging = false;
      this.currentIndex++;
      this.updateSlider();
      this.startAutoplay();
    } else if (movedBy > 50) {
      if (!this.loop && this.currentIndex <= 0) return;
      this.isDragging = false;
      this.currentIndex--;
      this.updateSlider();
      this.startAutoplay();
    } else {
      this.track.style.transform = `translateX(${
        -(this.currentIndex * (this.cardWidth + this.gap)) + movedBy
      }px)`;
    }
  }

  touchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.updateSlider();
  }

  startAutoplay() {
    if (!this.autoplay) return;
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = setInterval(() => {
      this.currentIndex++;
      this.updateSlider();
    }, this.autoplayDelay);
  }

  recalculate() {
    this.calculateResponsive();
    this.cardWidth = this.calculateCardWidth();
    this.setCardWidths();
    this.adjustLayout();
    this.updateSlider(false);
  }
}

document.querySelectorAll(".slider").forEach((sliderEl) => {
  new CustomSlider(sliderEl, {
    loop: false,
    autoplay: false,
    autoplayDelay: 5000,
  });
});
