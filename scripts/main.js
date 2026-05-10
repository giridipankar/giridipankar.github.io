/**
 * main.js — Portfolio interaction scripts
 *
 * Responsibilities:
 *  1. Scroll-reveal animation via IntersectionObserver
 *  2. Animated skill bar fills on scroll
 *  3. Active nav-link highlight on scroll
 *
 * NOTE (Next.js migration): Move each block into the relevant
 * component's useEffect hook. Replace direct DOM queries with
 * React refs where appropriate.
 */

// ── 1. Scroll Reveal ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.style.getPropertyValue('--delay')) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── 2. Skill Bar Fills ────────────────────────────────────────────────────────
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((bar) => {
          bar.style.width = bar.dataset.w + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.bento').forEach((el) => barObserver.observe(el));

// ── 3. Active Nav Link on Scroll ─────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => navObserver.observe(section));
