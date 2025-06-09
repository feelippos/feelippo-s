document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu ---
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navContent = document.querySelector('.nav-content');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navContent && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navContent.classList.toggle('active');
    });

    navLinks.addEventListener('click', () => {
      navContent.classList.remove('active');
    });
  }

  // --- 2. Portfolio Tabs ---
  const tabs = document.querySelectorAll(".portfolio-tab");
  const portfolioGrids = document.querySelectorAll(".portfolio-grid[data-tab-content]");

  if (tabs.length > 0 && portfolioGrids.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tabTarget;
        tabs.forEach((t) => t.classList.remove("active"));
        portfolioGrids.forEach((grid) => (grid.style.display = "none"));
        tab.classList.add("active");
        const activeGrid = document.querySelector(`.portfolio-grid[data-tab-content="${target}"]`);
        if (activeGrid) {
          activeGrid.style.display = "flex";
        }
      });
    });
  }

  // --- 3. Back to Top Button ---
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 8.293l-6.293 6.293-1.414-1.414L12 5.464l7.707 7.708-1.414 1.414L12 8.293z"/></svg>`;
  backToTopButton.className = "back-to-top";
  document.body.appendChild(backToTopButton);
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- 4. Fade-in Sections ---
  const sections = document.querySelectorAll(".fade-in-section");
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  // --- 5. Lightbox for Detail Page ---
  const detailGallery = document.querySelector(".detail-gallery");
  if (detailGallery) {
    const galleryImages = Array.from(detailGallery.querySelectorAll("img"));
    let currentIndex = 0;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-overlay";
    lightbox.innerHTML = `
      <button class="lightbox-close"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
      <button class="lightbox-nav lightbox-prev"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
      <div class="lightbox-content"><img src="" alt="Zoomed Image"></div>
      <button class="lightbox-nav lightbox-next"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxContent = lightbox.querySelector(".lightbox-content");
    const lightboxImage = lightbox.querySelector("img");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    const lightboxPrev = lightbox.querySelector(".lightbox-prev");
    const lightboxNext = lightbox.querySelector(".lightbox-next");
    const lightboxCounter = lightbox.querySelector(".lightbox-counter");

    function showLightbox(index) {
      currentIndex = index;
      const img = galleryImages[index];
      
      lightboxContent.scrollTop = 0;
      lightboxContent.scrollLeft = 0;
      lightboxImage.src = img.src;
      lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
      
      (index === 0) ? lightboxPrev.classList.add("hidden") : lightboxPrev.classList.remove("hidden");
      (index === galleryImages.length - 1) ? lightboxNext.classList.add("hidden") : lightboxNext.classList.remove("hidden");
      
      lightbox.classList.add("visible");
      document.body.classList.add("lightbox-active");
    }

    galleryImages.forEach((image, index) => {
      image.addEventListener("click", () => showLightbox(index));
    });

    const closeLightbox = () => {
      lightbox.classList.remove("visible");
      document.body.classList.remove("lightbox-active");
    };

    const showPrev = () => { if (currentIndex > 0) showLightbox(currentIndex - 1); };
    const showNext = () => { if (currentIndex < galleryImages.length - 1) showLightbox(currentIndex + 1); };
    
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target === lightboxClose) closeLightbox(); });
    lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
    lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("visible")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
      }
    });
  }
  
  // --- 6. Contact Form ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const messageDiv = document.createElement("div");

      fetch(this.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.ok) {
          messageDiv.textContent = "Thank you for your message!";
          messageDiv.className = "form-success";
          contactForm.reset();
        } else {
          messageDiv.textContent = "Oops! There was a problem submitting your form";
          messageDiv.className = "form-error";
        }
        contactForm.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
      })
      .catch(() => {
        messageDiv.textContent = "Oops! There was a problem submitting your form";
        messageDiv.className = "form-error";
        contactForm.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
      });
    });
  }

});