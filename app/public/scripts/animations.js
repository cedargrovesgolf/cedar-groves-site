ScrollTrigger.batch('.img-anim', {
  onEnter: batch =>
    gsap.from(batch, {
      autoAlpha: 0,
      duration: 2,
      stagger: 0.1,
      ease: 'power3',
      overwrite: true
    })
});
