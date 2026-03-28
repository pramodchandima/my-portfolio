/**
 * Portfolio Website - Pramod Chandima
 * Features: AOS Initialization, Web3Forms Contact Handling, Smooth Scroll,
 * Tech Stack Animation, Three.js & p5.js Visuals, Image Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initial Scroll Settings
  window.scrollTo({ top: 0, behavior: 'instant' });
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Initialize AOS scroll animations (library loaded via defer)
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 60 });
  } else {
    // AOS not yet loaded (rare edge case), init after small delay
    window.addEventListener('load', () => {
      if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 60 });
    });
  }

  // ------------------------------
  // 1. Tech Stack - Animated Grid
  // ------------------------------
  const techStack = [
    { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6' },
    { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
    { name: 'Java', icon: 'fab fa-java', color: '#007396' },
    { name: 'SQL (MySQL)', icon: 'fas fa-database', color: '#4479A1' },
    { name: 'Python', icon: 'fab fa-python', color: '#3776AB' }
  ];

  const techGrid = document.getElementById('techGrid');
  if (techGrid) {
    techStack.forEach((tech, index) => {
      const techItem = document.createElement('div');
      techItem.className = 'tech-item';
      techItem.setAttribute('data-aos', 'fade-up');
      techItem.setAttribute('data-aos-delay', (index * 50).toString());
      techItem.innerHTML = `
        <i class="${tech.icon}" style="color: ${tech.color};"></i>
        <span>${tech.name}</span>
      `;
      techGrid.appendChild(techItem);
    });
  }

  // ------------------------------
  // 2. Contact Form Handler (Web3Forms API)
  // ------------------------------
  const contactForm = document.getElementById('contactForm');
  const feedbackDiv = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Form data gathering
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Basic Client-side Validation
      if (!name || !email || !message) {
        showFeedback('⚠️ Please fill in all required fields.', 'error');
        return;
      }

      // Show loading state on button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin ml-2"></i>';

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showFeedback(`✅ Thanks ${name}! Your message has been sent successfully.`, 'success');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }

      } catch (error) {
        console.error('Form submission error:', error);
        showFeedback('❌ Oops! Something went wrong. Please try again later.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Modern Feedback Message Helper
  function showFeedback(msg, type) {
    if (!feedbackDiv) return;

    if (feedbackDiv._hideTimer) clearTimeout(feedbackDiv._hideTimer);
    if (feedbackDiv._removeTimer) clearTimeout(feedbackDiv._removeTimer);

    feedbackDiv.innerHTML = msg;
    feedbackDiv.className = `form-feedback ${type}`; // Using a base class for styling

    feedbackDiv.style.display = 'block';
    feedbackDiv.style.opacity = '0';
    feedbackDiv.style.transform = 'translateX(-50%) translateY(-20px)';

    requestAnimationFrame(() => {
      feedbackDiv.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      feedbackDiv.style.opacity = '1';
      feedbackDiv.style.transform = 'translateX(-50%) translateY(0)';
    });

    feedbackDiv._hideTimer = setTimeout(() => {
      feedbackDiv.style.opacity = '0';
      feedbackDiv.style.transform = 'translateX(-50%) translateY(-20px)';
      feedbackDiv._removeTimer = setTimeout(() => {
        feedbackDiv.style.display = 'none';
      }, 500);
    }, 5000);
  }

  // ------------------------------
  // 3. Smooth Scroll & Navigation
  // ------------------------------
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === "#" || targetId === "") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        history.pushState(null, null, targetId);
      }
    });
  });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.clientHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();

  // ------------------------------
  // 4. CV Download Handler
  // ------------------------------
  const downloadBtn = document.getElementById('downloadCV');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showFeedback('✅ CV download started!', 'success');
    });
  }

  // ------------------------------
  // 5. Scroll Reveal Logic
  // ------------------------------
  const revealSections = document.querySelectorAll('section, .service-card, .project-card');
  revealSections.forEach(s => s.classList.add('section-hidden'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
      }
    });
  }, { threshold: 0.1 });

  revealSections.forEach(s => revealObserver.observe(s));

  // ------------------------------
  // 6. Three.js Background
  // ------------------------------
  const threeContainer = document.getElementById('threejs-canvas-container');
  if (threeContainer && typeof THREE !== 'undefined') {
    let scene, camera, renderer, particles;
    const initThree = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 20;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeContainer.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(5000 * 3);
      for (let i = 0; i < 5000 * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.035,
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      animateThree();
    };

    const animateThree = () => {
      requestAnimationFrame(animateThree);
      const time = Date.now() * 0.00005;
      particles.rotation.x = time * 0.25;
      particles.rotation.y = time * 0.2;
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    initThree();
  }

  // ------------------------------
  // 7. p5.js Starfield
  // ------------------------------
  const p5Container = document.getElementById('p5js-canvas-container');
  if (p5Container && typeof p5 !== 'undefined') {
    new p5((p) => {
      let stars = [];
      p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(p5Container);
        for (let i = 0; i < 400; i++) stars.push(new Star(p));
      };
      p.draw = () => {
        p.clear();
        p.translate(p.width / 2, p.height / 2);
        let speed = p.map(p.mouseX || p.width / 2, 0, p.width, 0.1, 1.5);
        stars.forEach(s => { s.update(speed); s.show(); });
      };
      p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);

      class Star {
        constructor(p) { this.p = p; this.respawn(); }
        respawn() {
          this.x = this.p.random(-this.p.width, this.p.width);
          this.y = this.p.random(-this.p.height, this.p.height);
          this.z = this.p.random(this.p.width);
        }
        update(speed) {
          this.z -= speed * 5;
          if (this.z < 1) this.respawn();
        }
        show() {
          let sx = this.p.map(this.x / this.z, 0, 1, 0, this.p.width);
          let sy = this.p.map(this.y / this.z, 0, 1, 0, this.p.height);
          let r = this.p.map(this.z, 0, this.p.width, 5, 0);
          this.p.fill(150, 150, 200, 180);
          this.p.noStroke();
          if (r > 0) this.p.ellipse(sx, sy, r, r);
        }
      }
    });
  }

  // ------------------------------
  // 8. Image Modal Logic
  // ------------------------------
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const projectImages = document.querySelectorAll('.project-img');

  if (imageModal && modalImage) {
    projectImages.forEach(container => {
      container.addEventListener('dblclick', function () {
        const img = this.querySelector('img');
        if (img) {
          modalImage.src = img.src;
          imageModal.style.display = 'flex';
          setTimeout(() => imageModal.classList.add('active'), 10);
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      imageModal.classList.remove('active');
      setTimeout(() => { imageModal.style.display = 'none'; }, 400);
      document.body.style.overflow = '';
    };

    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  // ------------------------------
  // 9. Disable Image Context Menu & Drag
  // ------------------------------
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('profile-image-overlay')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
});