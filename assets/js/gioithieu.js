const thumbSwiper = new Swiper(".thumb-swiper", {
  slidesPerView: 4,
  spaceBetween: 15,
  watchSlidesProgress: true,
});

const mainSwiper = new Swiper(".main-swiper", {
  loop: true,
  spaceBetween: 18,
  navigation: {
    nextEl: ".slider-btn.next",
    prevEl: ".slider-btn.prev",
  },
  thumbs: {
    swiper: thumbSwiper,
  },
});

const yearButtons = document.querySelectorAll(".year-btn");
const yearList = document.getElementById("yearList");
const yearOrder = Array.from(yearButtons).map((btn) =>
  parseInt(btn.dataset.year)
);
function updateYearView(activeYear) {
  const total = yearOrder.length;
  const index = yearOrder.indexOf(activeYear);

  let start = index - 2;
  let end = index + 3;

  if (start < 0) {
    end += -start;
    start = 0;
  }
  if (end > total - 1) {
    start -= end - (total - 1);
    end = total - 1;
    if (start < 0) start = 0;
  }

  yearButtons.forEach((btn, i) => {
    btn.classList.remove("active", "near", "faded", "visible");

    if (i >= start && i <= end) {
      btn.classList.add("visible");
      if (i === index) btn.classList.add("active");
      else if (Math.abs(i - index) === 1) btn.classList.add("near");
      else btn.classList.add("faded");
    }
  });

  const translateY = start * 40; // chiều cao mỗi item
  yearList.style.transform = `translateY(-${translateY}px)`;

  document.querySelectorAll(".year-content").forEach((el) => {
    el.classList.remove("active");
  });
  const content = document.getElementById(`y-${activeYear}`);
  if (content) content.classList.add("active");
}

yearButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const year = parseInt(btn.dataset.year);
    updateYearView(year);
  });
});

updateYearView(2016);
