document.addEventListener("DOMContentLoaded", function () {
  // Portfolio text animation
  const portfolio = document.getElementById("portfolio");
  const chars = portfolio.textContent.split('');
  portfolio.innerHTML = '';
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = `${i * 0.1}s`;
    portfolio.appendChild(span);
  });

  // Improved scroll-based active link update with smooth transitions
  const sectionIds = ['s', 'a', 'n', 'connect-section'];
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Throttle scroll events for better performance
  let scrollTimeout;
  
  function updateActiveLink() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    let activeSection = null;
    
    // Find the current section
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionIds[i]);
      if (section && scrollPosition >= section.offsetTop) {
        activeSection = sectionIds[i];
        break;
      }
    }
    
    // Update active states with smooth transition
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${activeSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll event handling
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 10);
  });

  // Manual navigation click handling for extra smooth scrolling
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active to clicked link
      this.classList.add('active');
      
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Custom smooth scroll with offset for fixed navbar
        const offsetTop = targetSection.offsetTop - 90;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced Intersection Observer for fade-in effects with stagger
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple elements
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, index * 200);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and fade-in elements
  document.querySelectorAll('.text-section, .about-section .details-box, .projects-container').forEach(el => {
    observer.observe(el);
  });

  // Image fade-in on load with error handling
  const image = document.getElementById("image");
  if (image) {
    image.addEventListener("load", () => {
      image.classList.add("loaded");
    });
    
    // Fallback if image is already loaded
    if (image.complete) {
      image.classList.add("loaded");
    }
  }

  // Enhanced notification system
  const notificationArea = document.getElementById("notification-area");
  const emailForm = document.getElementById("form-email");

  function showNotification(message, type = "success", duration = 3000) {
    const id = Date.now();
    const div = document.createElement("div");
    div.className = `notification ${type}`;
    div.textContent = message;
    div.id = id;
    
    // Add click to dismiss
    div.addEventListener('click', () => div.remove());
    
    notificationArea.appendChild(div);
    
    // Auto remove after duration
    setTimeout(() => {
      if (document.getElementById(id)) {
        div.style.animation = 'slideInNotification 0.3s ease reverse';
        setTimeout(() => div.remove(), 300);
      }
    }, duration);
  }

  // Enhanced form handling with better validation
  if (emailForm) {
    emailForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const linkedin = document.querySelector('input[name="linkedin"]').value.trim();
      const instagram = document.querySelector('input[name="instagram"]').value.trim();
      const email = document.querySelector('input[name="email"]').value.trim();

      // Improved validation
      if (!linkedin || !instagram || !email) {
        showNotification("❌ All fields are required", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("❌ Please enter a valid email address", "error");
        return;
      }

      // Show loading state
      const submitButton = document.querySelector('.submit-button');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      try {
        const formData = new URLSearchParams({ linkedin, instagram, email });

        const response = await fetch("/connect", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });

        if (response.ok) {
          showNotification("✅ Details submitted successfully!", "success");
          document.querySelectorAll(".connect-input").forEach(input => {
            input.value = "";
          });
        } else {
          const errorText = await response.text();
          showNotification(`❌ Submission failed: ${response.status}`, "error");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        showNotification("❌ Network error. Please try again!", "error");
      } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Add smooth navbar background change on scroll
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      nav.style.background = 'rgba(30, 41, 59, 0.98)';
      nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(30, 41, 59, 0.95)';
      nav.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
  });

  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // Ensure focus is visible for accessibility
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Initial active link setup
  updateActiveLink();
});

