(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  const progress = document.getElementById("readingProgress");
  const header = document.querySelector(".site-header");
  const backToTop = document.getElementById("backToTop");
  const year = document.getElementById("year");
  const navCollapse = document.getElementById("mainNav");

  // Keep the footer year current.
  if (year) year.textContent = new Date().getFullYear();

  // Reveal content as it enters the viewport.
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Scroll progress, sticky-header state and back-to-top visibility.
  let ticking = false;
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Back-to-top control.
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  // Close the Bootstrap mobile navigation after choosing a section.
  navCollapse?.querySelectorAll("a.nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navCollapse.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Highlight the current section in the navigation.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-link").forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
