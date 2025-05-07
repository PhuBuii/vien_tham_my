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
const contentSections = document.querySelectorAll(".year-content");
const allYears = Array.from(yearButtons).map((btn) =>
  parseInt(btn.dataset.year)
);
const visibleRange = 2;
let selectedYear = 2016;

updateUI(selectedYear);

yearButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedYear = parseInt(btn.dataset.year);
    updateUI(selectedYear);
  });
});

function updateUI(selected) {
  const selectedIndex = allYears.indexOf(selected);
  let startIndex = Math.max(0, selectedIndex - 2);
  let endIndex = startIndex + 5;

  if (endIndex > allYears.length) {
    endIndex = allYears.length;
    startIndex = Math.max(0, endIndex - 5);
  }

  yearButtons.forEach((btn, i) => {
    const year = parseInt(btn.dataset.year);
    btn.classList.remove("selected", "visible", "faded");

    if (i >= startIndex && i < endIndex) {
      btn.classList.add("visible");

      const isSelected = i === selectedIndex;
      const isAdjacent = i === selectedIndex - 1 || i === selectedIndex + 1;

      if (isSelected) {
        btn.classList.add("selected");
      } else if (!isAdjacent) {
        btn.classList.add("faded");
      }
    }
  });

  contentSections.forEach((sec) => {
    sec.classList.remove("active");
  });

  const activeContent = document.getElementById(`y-${selected}`);
  if (activeContent) activeContent.classList.add("active");
}
