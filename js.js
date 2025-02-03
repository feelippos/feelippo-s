document.addEventListener('DOMContentLoaded', () => {
  /* Mobile Menu Toggle */
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navContent = document.querySelector('.nav-content');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      // Toggle active class on the nav-content to show/hide nav-links
      navContent.classList.toggle('active');
    });
  }

  /* Portfolio Tabs (existing functionality) */
  const tabs = document.querySelectorAll(".portfolio-tab");
  const contents = document.querySelectorAll("[data-tab-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => (c.style.display = "none"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab-target");
      const targetContent = document.querySelector(`[data-tab-content="${target}"]`);
      if (targetContent) {
        targetContent.style.display = "grid";
      }
    });
  });

  /* Contact Form Submission */
  const contactForm = document.getElementById('contact-form');
  const thankYouMessage = document.getElementById('thank-you');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Construct the mailto: URL (adjust the email address as needed)
      const mailtoLink = `mailto:Filippolaferlita@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;

      // Optionally, you could open the email client:
      window.location.href = mailtoLink;

      // Show the thank you message (in English)
      thankYouMessage.style.display = 'block';

      // Optionally, hide the thank you message after a few seconds
      setTimeout(() => {
        thankYouMessage.style.display = 'none';
      }, 5000);

      // Reset the form (if desired)
      contactForm.reset();
    });
  }
});