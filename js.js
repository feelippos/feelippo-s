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
  
  // --- 2. Portfolio Tabs & Slider ---
  const tabs = document.querySelectorAll(".portfolio-tab");
  const sliderContainer = document.querySelector('.portfolio-slider-container');
  const portfolioContents = document.querySelectorAll(".portfolio-grid[data-tab-content]");

  // Slider Logic
  const slider = document.querySelector('.portfolio-grid.slider');
  
  if (slider) {
      const prevBtn = document.querySelector('.slider-arrow.prev');
      const nextBtn = document.querySelector('.slider-arrow.next');
      const cards = slider.querySelectorAll('.watch-card-link');
      const totalCards = cards.length;
      let cardsVisible = 3; // Default for desktop
      
      const updateCardsVisible = () => {
        if (window.innerWidth <= 1200) {
            cardsVisible = 1; // On mobile/tablet view, we scroll one card at a time
        } else {
            cardsVisible = 3;
        }
      };
      updateCardsVisible();


      let currentIndex = 0;

      if (totalCards <= cardsVisible) {
        if(prevBtn) prevBtn.classList.add('hidden');
        if(nextBtn) nextBtn.classList.add('hidden');
      }

      const updateSlider = () => {
          if (cards.length === 0) return;
          
          updateCardsVisible();

          const cardWidth = cards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(slider).gap, 10) || 32; // 2rem fallback
          const moveDistance = (cardWidth + gap) * currentIndex;
          
          slider.style.transform = `translateX(-${moveDistance}px)`;

          if(prevBtn) prevBtn.classList.toggle('hidden', currentIndex === 0);
          if(nextBtn) nextBtn.classList.toggle('hidden', currentIndex >= totalCards - cardsVisible);
      };
      
      if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalCards - cardsVisible) {
                currentIndex++;
                updateSlider();
            }
        });
      }

      if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
      }
      
      updateSlider(); 
      window.addEventListener('resize', updateSlider);
  }

  // Tab Logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab-target');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      portfolioContents.forEach(content => {
          if (content.closest('.portfolio-slider-container')) {
              if(sliderContainer) sliderContainer.style.display = 'none';
          } else {
              content.style.display = 'none';
          }
      });
      
      if (targetId === 'current') {
        if(sliderContainer) sliderContainer.style.display = 'block';
      } else {
        const targetContent = document.querySelector(`.portfolio-grid[data-tab-content="${targetId}"]`);
        if (targetContent) {
            targetContent.style.display = 'flex';
        }
      }
    });
  });


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
    if (galleryImages.length === 0) return;
    
    let currentLightboxIndex = 0;
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
    
    const lightboxImage = lightbox.querySelector("img");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    const lightboxPrev = lightbox.querySelector(".lightbox-prev");
    const lightboxNext = lightbox.querySelector(".lightbox-next");
    const lightboxCounter = lightbox.querySelector(".lightbox-counter");

    function showLightbox(index) {
      currentLightboxIndex = index;
      lightboxImage.src = galleryImages[index].src;
      lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
      lightboxPrev.classList.toggle("hidden", index === 0);
      lightboxNext.classList.toggle("hidden", index === galleryImages.length - 1);
      lightbox.classList.add("visible");
      document.body.classList.add("lightbox-active");
    }
    const closeLightbox = () => {
      lightbox.classList.remove("visible");
      document.body.classList.remove("lightbox-active");
    };
    const showPrev = () => { if (currentLightboxIndex > 0) showLightbox(currentLightboxIndex - 1); };
    const showNext = () => { if (currentLightboxIndex < galleryImages.length - 1) showLightbox(currentLightboxIndex + 1); };
    
    galleryImages.forEach((image, index) => image.addEventListener("click", () => showLightbox(index)));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target === lightboxClose || e.target.closest('.lightbox-close')) closeLightbox(); });
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
  const contactForms = document.querySelectorAll(".contact-form form");
  if (contactForms.length > 0) {
    contactForms.forEach(contactForm => {
        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const formData = new FormData(this);
          const existingMessage = contactForm.querySelector('.form-success, .form-error');
          if (existingMessage) existingMessage.remove();
    
          const messageDiv = document.createElement("div");
    
          // Placeholder for Formspree/other service
          // Simulating a success response for demonstration
          setTimeout(() => {
              messageDiv.textContent = "Thank you for your message!";
              messageDiv.className = "form-success";
              contactForm.reset();
              contactForm.appendChild(messageDiv);
              setTimeout(() => messageDiv.remove(), 5000);
          }, 1000);
        });
    });
  }
});