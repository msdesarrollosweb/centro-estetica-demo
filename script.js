'use strict';

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const reveals = document.querySelectorAll('.reveal');
const galleryButtons = document.querySelectorAll('[data-image]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-img]');

const setScrolledHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

window.addEventListener('scroll', setScrolledHeader, { passive: true });
setScrolledHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

navLinks?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

reveals.forEach((item) => revealObserver.observe(item));

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.getAttribute('data-image');
    if (!image || !lightbox || !lightboxImg) return;
    lightboxImg.src = image;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
};

lightbox?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
});

// Carrusel accesible para la sección de opiniones.
const testimonialTrack = document.querySelector('[data-testimonial-track]');
const testimonialPrev = document.querySelector('[data-testimonial-prev]');
const testimonialNext = document.querySelector('[data-testimonial-next]');
const testimonialDots = document.querySelector('[data-testimonial-dots]');
let testimonialIndex = 0;

const getVisibleTestimonials = () => {
  if (window.matchMedia('(max-width: 620px)').matches) return 1;
  if (window.matchMedia('(max-width: 980px)').matches) return 2;
  return 3;
};

const renderTestimonialDots = () => {
  if (!testimonialTrack || !testimonialDots) return;
  const total = testimonialTrack.children.length;
  const maxIndex = Math.max(0, total - getVisibleTestimonials());
  testimonialDots.innerHTML = '';
  for (let i = 0; i <= maxIndex; i += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver grupo de opiniones ${i + 1}`);
    button.addEventListener('click', () => {
      testimonialIndex = i;
      updateTestimonials();
    });
    testimonialDots.appendChild(button);
  }
};

const updateTestimonials = () => {
  if (!testimonialTrack || !testimonialDots) return;
  const visible = getVisibleTestimonials();
  const total = testimonialTrack.children.length;
  const maxIndex = Math.max(0, total - visible);
  testimonialIndex = Math.min(Math.max(testimonialIndex, 0), maxIndex);
  const firstCard = testimonialTrack.children[0];
  const gap = 22;
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;
  testimonialDots.querySelectorAll('button').forEach((button, index) => {
    button.classList.toggle('active', index === testimonialIndex);
  });
};

testimonialPrev?.addEventListener('click', () => {
  testimonialIndex -= 1;
  updateTestimonials();
});

testimonialNext?.addEventListener('click', () => {
  testimonialIndex += 1;
  updateTestimonials();
});

window.addEventListener('resize', () => {
  renderTestimonialDots();
  updateTestimonials();
}, { passive: true });

renderTestimonialDots();
updateTestimonials();
