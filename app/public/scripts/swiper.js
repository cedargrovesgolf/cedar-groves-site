const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  slidesPerGroup: 1,
  spaceBetween: 20,
  scrollDirection: "horizontal",
  loop: true,
  allowTouchMove: false,
  resizeObserver: true,

  pagination: {
    el: ".swiper-pagination",
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    320: {
      slidesPerView: 1,
    },

    696: {
      slidesPerView: 2,
    },

    1030: {
      slidesPerView: 3,
    },
  },

  on: {
    resize: function () {
      const swiperSlides = this.el.querySelectorAll(".swiper-slide");
      swiperSlides.forEach((slide) => {
        slide.style.height = "auto";
      });
      let maxHeight = 0;
      swiperSlides.forEach((slide) => {
        const slideHeight = slide.offsetHeight;
        if (slideHeight > maxHeight) {
          maxHeight = slideHeight;
        }
      });
      swiperSlides.forEach((slide) => {
        slide.style.height = `${maxHeight}px`;
      });
    },
  },
});
