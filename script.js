/* =================================================================
   CYBERSHIELD — CYBER SECURITY AWARENESS WEBSITE
   script.js — all interactive behaviour, organised by feature
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. PRELOADER
     Hides the loading screen once the page has fully loaded.
  --------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 400);
  });
  // Safety net: never let the preloader trap a user if 'load' is slow.
  setTimeout(() => preloader.classList.add('loaded'), 3500);


  /* ---------------------------------------------------------------
     2. MOBILE NAVIGATION TOGGLE
  --------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close the mobile menu whenever a link is chosen
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ---------------------------------------------------------------
     3. NAVBAR BACKGROUND ON SCROLL + SCROLLSPY (active link)
  --------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  // Declared here (not in section 5 below) because handleScrollEffects()
  // below reads it immediately — it must exist before that first call.
  const backToTop = document.getElementById('backToTop');

  function handleScrollEffects() {
    // Navbar background
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Scrollspy: highlight the nav link for the section in view
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) currentId = section.id;
    });
    navAnchors.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });

    // Back-to-top button visibility
    backToTop.classList.toggle('show', window.scrollY > 500);
  }

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects();


  /* ---------------------------------------------------------------
     4. SMOOTH SCROLL FOR ALL ANCHOR LINKS (with navbar offset)
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = target.offsetTop - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ---------------------------------------------------------------
     5. BACK TO TOP BUTTON
  --------------------------------------------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------
     6. SCROLL-TRIGGERED REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));


  /* ---------------------------------------------------------------
     7. HERO TYPING EFFECT
     Cycles through short awareness statements, typing & deleting
     them one character at a time.
  --------------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const heroPhrases = [
    'Cybersecurity awareness is your first line of defense.',
    'Think before you click — most attacks rely on you.',
    'Strong passwords and good habits stop most breaches.',
    'Stay alert. Stay informed. Stay secure.'
  ];

  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const currentPhrase = heroPhrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typedTextEl.textContent = currentPhrase.slice(0, charIndex);
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800); // pause before deleting
        return;
      }
      setTimeout(typeLoop, 38);
    } else {
      charIndex--;
      typedTextEl.textContent = currentPhrase.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % heroPhrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 18);
    }
  }
  typeLoop();


  /* ---------------------------------------------------------------
     8. HERO TERMINAL — fake "security scan" log lines
  --------------------------------------------------------------- */
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = [
    { text: '$ initiating_security_scan.sh', cls: '' },
    { text: '> Checking firewall.................. OK', cls: 'ok' },
    { text: '> Scanning for malware................ OK', cls: 'ok' },
    { text: '> Verifying password strength......... WEAK', cls: 'bad' },
    { text: '> Two-factor authentication........... DISABLED', cls: 'warn' },
    { text: '> Recommendation: enable 2FA & update password', cls: 'warn' },
    { text: '> Scan complete. Stay alert out there.', cls: 'ok' }
  ];

  function playTerminal() {
    terminalBody.innerHTML = '';
    terminalLines.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.className = `line ${line.cls}`;
        p.textContent = line.text;
        terminalBody.appendChild(p);
      }, i * 550);
    });
  }
  setTimeout(playTerminal, 600);


  /* ---------------------------------------------------------------
     9. HERO BACKGROUND — animated particle "network" on canvas
     Skips/keeps minimal animation if the user prefers reduced motion.
  --------------------------------------------------------------- */
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles = [];
  const PARTICLE_COUNT = 55;
  const LINK_DISTANCE = 130;

  function resizeCanvas() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 1
    }));
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update + draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 157, ${1 - dist / LINK_DISTANCE})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) requestAnimationFrame(drawNetwork);
  }

  resizeCanvas();
  createParticles();
  drawNetwork(); // draws one static frame if reduced motion is preferred

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });


  /* ---------------------------------------------------------------
     10. PASSWORD STRENGTH CHECKER
  --------------------------------------------------------------- */
  const passwordInput = document.getElementById('passwordInput');
  const togglePassword = document.getElementById('togglePassword');
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthLabel = document.getElementById('strengthLabel');
  const suggestionsList = document.getElementById('suggestionsList');

  const COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'letmein',
    'monkey', 'football', 'iloveyou', 'admin', 'welcome', 'password1',
    '123123', '000000', '111111', 'qwerty123'
  ];

  // Show / hide password text
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';
  });

  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;

    if (value.length === 0) {
      strengthMeter.className = 'strength-meter';
      strengthLabel.textContent = 'Enter a password above to begin';
      suggestionsList.innerHTML = '';
      return;
    }

    const suggestions = [];
    let label = 'Weak';
    let meterClass = 'weak';

    // A leaked/common password is always treated as weak, no matter what
    if (COMMON_PASSWORDS.includes(value.toLowerCase())) {
      label = 'Weak';
      meterClass = 'weak';
      suggestions.push('This is one of the most commonly used passwords — pick something unique.');
    } else {
      // Run individual strength checks
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);
      const longEnough = value.length >= 8;
      const veryLong = value.length >= 12;

      // Count how many criteria are met (max 6)
      let metCount = [hasLower, hasUpper, hasNumber, hasSpecial, longEnough, veryLong]
        .filter(Boolean).length;

      if (!longEnough) {
        // Force "weak" if shorter than the minimum recommended length
        label = 'Weak';
        meterClass = 'weak';
        suggestions.push('Use at least 8 characters (12+ is even better).');
      } else if (metCount <= 3) {
        label = 'Weak';
        meterClass = 'weak';
      } else if (metCount === 4) {
        label = 'Medium';
        meterClass = 'medium';
      } else if (metCount === 5) {
        label = 'Strong';
        meterClass = 'strong';
      } else {
        label = 'Very Strong';
        meterClass = 'very-strong';
      }

      if (!hasLower) suggestions.push('Add a lowercase letter.');
      if (!hasUpper) suggestions.push('Add an uppercase letter.');
      if (!hasNumber) suggestions.push('Add a number.');
      if (!hasSpecial) suggestions.push('Add a special character (e.g. ! @ # $).');
      if (!veryLong) suggestions.push('Make it 12+ characters for extra strength.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Great password! Just make sure it\'s not reused anywhere else.');
    }

    strengthMeter.className = `strength-meter ${meterClass}`;
    strengthLabel.textContent = `Strength: ${label}`;
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
  });


  /* ---------------------------------------------------------------
     11. SAFETY TIPS CHECKLIST — live progress bar
  --------------------------------------------------------------- */
  const tipChecks = document.querySelectorAll('.tip-check');
  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');

  function updateProgress() {
    const total = tipChecks.length;
    const checked = document.querySelectorAll('.tip-check:checked').length;
    progressFill.style.width = `${(checked / total) * 100}%`;
    progressCount.textContent = `${checked} / ${total} habits`;
  }

  tipChecks.forEach(box => {
    box.addEventListener('change', () => {
      // Toggle a class on the parent card too, as a fallback for browsers
      // that don't yet support the CSS :has() selector used in style.css
      box.closest('.tip-card').classList.toggle('checked-tip', box.checked);
      updateProgress();
    });
  });


  /* ---------------------------------------------------------------
     12. CYBERSECURITY QUIZ
  --------------------------------------------------------------- */
  const quizData = [
    {
      question: 'You get an email saying your bank account will be suspended unless you verify your details immediately. What should you do?',
      options: [
        'Click the link in the email and enter your details quickly',
        'Reply to the email with your account number to be safe',
        'Ignore the email and contact your bank directly using their official app or number',
        'Forward it to friends to warn them, then click the link'
      ],
      correct: 2
    },
    {
      question: 'Which of these passwords would be considered the strongest?',
      options: ['password123', 'John1990', 'Tr@vel#Galaxy92!', '123456789'],
      correct: 2
    },
    {
      question: "What does the term '2FA' stand for?",
      options: ['Two-Factor Authentication', 'Two-File Access', 'Firewall Activation', 'Two-Factor Antivirus'],
      correct: 0
    },
    {
      question: 'What is ransomware?',
      options: [
        'A free tool that speeds up your computer',
        'Malware that encrypts your files and demands payment to unlock them',
        'A type of password manager',
        'A setting that boosts your Wi-Fi signal'
      ],
      correct: 1
    },
    {
      question: 'Which of these is a common warning sign of a phishing message?',
      options: [
        "A personalised greeting that uses your full name and order history",
        'Urgent, threatening language demanding you act within minutes',
        "An email sent from a domain you've verified before",
        'No links, attachments, or requests for personal information'
      ],
      correct: 1
    }
  ];

  const quizQuestionsEl = document.getElementById('quizQuestions');
  const quizForm = document.getElementById('quizForm');
  const quizWarning = document.getElementById('quizWarning');
  const quizResults = document.getElementById('quizResults');
  const quizSubmitBtn = document.getElementById('quizSubmitBtn');
  const scoreValue = document.getElementById('scoreValue');
  const scoreMessage = document.getElementById('scoreMessage');
  const retakeBtn = document.getElementById('retakeBtn');

  // Build the quiz markup from the quizData array
  function renderQuiz() {
    quizQuestionsEl.innerHTML = quizData.map((q, qIndex) => `
      <div class="quiz-question">
        <h4>Q${qIndex + 1}. ${q.question}</h4>
        <div class="quiz-options">
          ${q.options.map((opt, oIndex) => `
            <label class="quiz-option" data-question="${qIndex}" data-option="${oIndex}">
              <input type="radio" name="question-${qIndex}" value="${oIndex}">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
  renderQuiz();

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Make sure every question has an answer before grading
    const unanswered = quizData.some((_, i) => !quizForm.querySelector(`input[name="question-${i}"]:checked`));
    if (unanswered) {
      quizWarning.classList.add('show');
      return;
    }
    quizWarning.classList.remove('show');

    // Grade the quiz and visually mark correct / incorrect choices
    let score = 0;
    quizData.forEach((q, i) => {
      const selected = quizForm.querySelector(`input[name="question-${i}"]:checked`);
      const selectedValue = parseInt(selected.value, 10);
      if (selectedValue === q.correct) score++;

      quizForm.querySelectorAll(`label[data-question="${i}"]`).forEach(label => {
        const optionIndex = parseInt(label.dataset.option, 10);
        if (optionIndex === q.correct) label.classList.add('correct-answer');
        else if (optionIndex === selectedValue) label.classList.add('wrong-answer');
        label.querySelector('input').disabled = true; // lock answers after submitting
      });
    });

    // Pick a tiered feedback message based on the score
    let message;
    if (score === 5) message = 'Perfect score! You clearly know how to spot a threat.';
    else if (score === 4) message = "Great job! You have a strong grasp of cyber security basics.";
    else if (score === 3) message = 'Good effort — revisit the sections above to close a few gaps.';
    else message = "There's room to grow. Scroll back up and review the threats and safety tips.";

    scoreValue.textContent = score;
    scoreMessage.textContent = message;
    quizResults.classList.add('show');
    quizSubmitBtn.style.display = 'none';
  });

  retakeBtn.addEventListener('click', () => {
    renderQuiz();              // rebuild fresh, unanswered questions
    quizResults.classList.remove('show');
    quizWarning.classList.remove('show');
    quizSubmitBtn.style.display = 'inline-flex';
    quizForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });


  /* ---------------------------------------------------------------
     13. CONTACT FORM — front-end validation + demo submit
  --------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const messageInput = document.getElementById('messageInput');
  const formSuccess = document.getElementById('formSuccess');

  function setFieldError(input, errorEl, message) {
    const group = input.closest('.form-group');
    if (message) {
      group.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      group.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name validation
    if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, document.getElementById('nameError'), 'Please enter your name.');
      isValid = false;
    } else {
      setFieldError(nameInput, document.getElementById('nameError'), '');
    }

    // Email validation (simple pattern check)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, document.getElementById('emailError'), 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(emailInput, document.getElementById('emailError'), '');
    }

    // Message validation
    if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, document.getElementById('messageError'), 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      setFieldError(messageInput, document.getElementById('messageError'), '');
    }

    if (!isValid) {
      formSuccess.classList.remove('show');
      return;
    }

    // No backend is connected in this demo — simulate a successful send
    formSuccess.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  });


  /* ---------------------------------------------------------------
     14. FOOTER — dynamic copyright year
  --------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
