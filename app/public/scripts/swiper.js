/* swiper.js */
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  slidesPerView: 3,
  slidesPerGroup: 1,
  spaceBetween: 20,
  scrollDirection: 'horizontal',
  loop: true,
  lazy: true,
  allowTouchMove: false,
  pagination: {
    el: '.swiper-pagination'
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      allowTouchMove: true
    },

    696: {
      slidesPerView: 2,
      allowTouchMove: true
    },

    1030: {
      slidesPerView: 3,
      allowTouchMove: false
    }
  }
});
