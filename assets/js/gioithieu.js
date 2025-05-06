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
