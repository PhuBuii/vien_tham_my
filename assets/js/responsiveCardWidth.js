// responsiveCardWidth.js
export function calculateCardWidthGlobal() {
  const gap = 20;
  const windowWidth = window.innerWidth;

  let responsiveVisible =
    windowWidth <= 576
      ? 1
      : windowWidth <= 768
      ? 2
      : windowWidth <= 1200
      ? 3
      : 4;

  // Width tính theo 79% của body (đồng bộ với slider)
  const baseWidth = document.body.clientWidth * 0.79;
  const cardWidth = (baseWidth - gap * responsiveVisible) / responsiveVisible;

  const allCards = document.querySelectorAll(".slider-card");

  allCards.forEach((card) => {
    card.style.width = `${cardWidth}px`;
    card.style.flex = "0 0 auto";
  });
}
