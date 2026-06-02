/* ══════════════════════════════════════════════════════
   AZIM AKBAY — PORTFOLIO APP.JS
   Particle canvas, typewriter, scroll reveal, nav, form
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Particle Canvas ─────────────────────────── */
  var canvas = document.getElementById('particles-canvas');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null };
    var w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function seed() {
      var n = Math.min(Math.floor((w * h) / 14000), 100);
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.5,
          a: Math.random() * 0.45 + 0.1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        if (mouse.x !== null) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            p.x += dx * ((140 - d) / 140) * 0.018;
            p.y += dy * ((140 - d) / 140) * 0.018;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(0,212,255,' + p.a + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx2 = p.x - q.x;
          var dy2 = p.y - q.y;
          var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(0,212,255,' + (0.07 * (1 - d2 / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    window.addEventListener('resize', function () { resize(); seed(); });

    var heroEl = canvas.parentElement;
    heroEl.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    heroEl.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ── 2. Typewriter ──────────────────────────────── */
  var typed = document.getElementById('typed');
  if (typed) {
    var phrases = [
      'Full-Stack Developer',
      'Websites & Webapplicaties',
      'IT-oplossingen op maat',
      'Beschikbaar voor projecten'
    ];
    var pi = 0, ci = 0, deleting = false;

    if (reducedMotion) {
      typed.textContent = phrases[0];
    } else {
      (function tick() {
        var cur = phrases[pi];
        typed.textContent = deleting
          ? cur.substring(0, --ci)
          : cur.substring(0, ++ci);

        var delay = deleting ? 28 : 55;
        if (!deleting && ci === cur.length) { delay = 2000; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ── 3. Scroll Reveal ───────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reducedMotion) {
      for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('visible');
    } else {
      var obs = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('visible');
            obs.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      for (var i = 0; i < reveals.length; i++) obs.observe(reveals[i]);
    }
  }

  /* ── 4. Navbar ──────────────────────────────────── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  if (nav && toggle && menu) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 40) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
          ticking = false;
        });
        ticking = true;
      }
    });

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ── 5. Active nav tracking ─────────────────────── */
  var sections = document.querySelectorAll('section[id], header[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length) {
    var secObs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var id = entries[i].target.getAttribute('id');
          for (var j = 0; j < navLinks.length; j++) {
            if (navLinks[j].getAttribute('href') === '#' + id) navLinks[j].classList.add('active');
            else navLinks[j].classList.remove('active');
          }
        }
      }
    }, { threshold: 0.25, rootMargin: '-80px 0px -35% 0px' });
    for (var i = 0; i < sections.length; i++) secObs.observe(sections[i]);
  }

  /* ── 6. Contact Form ────────────────────────────── */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var submitText = document.getElementById('submitText');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitText.textContent = 'Verzenden...';
      status.className = 'form-status';

      var data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Bedankt! Je bericht is succesvol verzonden.';
          status.className = 'form-status ok show';
          form.reset();
        } else {
          status.textContent = 'Er is iets misgegaan. Probeer het later opnieuw.';
          status.className = 'form-status err show';
        }
      }).catch(function () {
        status.textContent = 'Netwerkfout. Controleer je internetverbinding.';
        status.className = 'form-status err show';
      }).finally(function () {
        submitBtn.disabled = false;
        submitText.textContent = 'Verstuur bericht';
      });
    });
  }

})();
