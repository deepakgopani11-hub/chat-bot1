/* ==========================================================================
   SmartStart AI — Client-Side JavaScript
   Handles mobile menu navigation, smooth scrolling, and contact form handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (mobileToggle && siteNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when clicking any nav link
    const navLinks = siteNav.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. Contact Form Submission (Simple, Local, Zero Paid Services)
  const contactForm = document.getElementById('contact-form');
  const notificationBox = document.getElementById('form-notification');

  if (contactForm && notificationBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const messageInput = document.getElementById('user-message');
      const serviceSelect = document.getElementById('user-service');

      let isValid = true;

      // Validate Name
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate Email (simple regex pattern)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailGroup = emailInput.closest('.form-group');
      if (!emailPattern.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // Validate Message
      const messageGroup = messageInput.closest('.form-group');
      if (!messageInput.value.trim()) {
        messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        messageGroup.classList.remove('has-error');
      }

      if (!isValid) {
        notificationBox.className = 'form-notification';
        notificationBox.style.display = 'none';
        return;
      }

      // Friendly beginner-friendly success demonstration
      const senderName = nameInput.value.trim();
      const chosenService = serviceSelect.options[serviceSelect.selectedIndex].text;

      notificationBox.className = 'form-notification success';
      notificationBox.innerHTML = `
        🎉 <strong>Thank you, ${senderName}!</strong><br>
        Your inquiry about <em>"${chosenService}"</em> has been received. 
        Our team will follow up via your email shortly!
      `;
      notificationBox.style.display = 'block';

      // Reset input fields
      contactForm.reset();

      // Scroll smoothly to notification if on small screen
      notificationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Clear error highlights as user types
    ['user-name', 'user-email', 'user-message'].forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', () => {
          const group = field.closest('.form-group');
          if (group && group.classList.contains('has-error')) {
            group.classList.remove('has-error');
          }
        });
      }
    });
  }
});
