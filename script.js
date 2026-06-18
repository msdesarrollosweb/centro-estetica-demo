'use strict';

const WHATSAPP_NUMBER = '541127549094';

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const reveals = document.querySelectorAll('.reveal');
const bookingForm = document.querySelector('[data-booking-form]');
const formStatus = document.querySelector('[data-form-status]');
const testimonialTrack = document.querySelector('[data-testimonial-track]');
const testimonialPrev = document.querySelector('[data-testimonial-prev]');
const testimonialNext = document.querySelector('[data-testimonial-next]');

const setScrolledHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

window.addEventListener('scroll', setScrolledHeader, { passive: true });
setScrolledHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', Boolean(isOpen));
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

navLinks?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

const scrollTestimonials = (direction) => {
  if (!testimonialTrack) return;
  const distance = testimonialTrack.clientWidth * 0.9;
  testimonialTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
};

testimonialPrev?.addEventListener('click', () => scrollTestimonials(-1));
testimonialNext?.addEventListener('click', () => scrollTestimonials(1));

const sanitizeValue = (value) => String(value || '').replace(/[<>]/g, '').trim();

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    if (formStatus) formStatus.textContent = 'Completá los campos obligatorios para continuar.';
    return;
  }

  const data = new FormData(bookingForm);
  const nombre = sanitizeValue(data.get('nombre'));
  const telefono = sanitizeValue(data.get('telefono'));
  const email = sanitizeValue(data.get('email')) || 'No informado';
  const tratamiento = sanitizeValue(data.get('tratamiento'));
  const fecha = sanitizeValue(data.get('fecha'));
  const horario = sanitizeValue(data.get('horario'));
  const mensaje = sanitizeValue(data.get('mensaje')) || 'Sin mensaje adicional';

  const text = `Hola Aura Bella, quiero reservar un turno.%0A%0A` +
    `Nombre: ${encodeURIComponent(nombre)}%0A` +
    `Teléfono: ${encodeURIComponent(telefono)}%0A` +
    `Email: ${encodeURIComponent(email)}%0A` +
    `Tratamiento: ${encodeURIComponent(tratamiento)}%0A` +
    `Fecha preferida: ${encodeURIComponent(fecha)}%0A` +
    `Horario preferido: ${encodeURIComponent(horario)}%0A` +
    `Consulta: ${encodeURIComponent(mensaje)}`;

  if (formStatus) formStatus.textContent = 'Abriendo WhatsApp para confirmar tu consulta...';
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
});
