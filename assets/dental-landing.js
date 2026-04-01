'use strict';
document.addEventListener('DOMContentLoaded', function() {

  /* === Swiper: Testimonials (NO autoplay) === */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.dental-testimonials__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      grabCursor: true,
      loop: true
    });
    new Swiper('.dental-ba__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      grabCursor: true,
      freeMode: true
    });
  }

  /* === Calculator === */
  var costPerKit = 34;
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function calc() {
    var rEl = document.getElementById('resale-price');
    var pEl = document.getElementById('patients');
    var cEl = document.getElementById('conversion');
    var bEl = document.getElementById('bonus');
    if (!rEl || !pEl || !cEl || !bEl) return;

    var r = parseFloat(rEl.value) || 149;
    var p = parseFloat(pEl.value) || 2000;
    var c = parseFloat(cEl.value) || 10;
    var b = parseFloat(bEl.value) || 10;
    var profit = r - costPerKit - b;
    var kits = Math.round(p * (c / 100));
    var rev = kits * r;
    var total = kits * profit;

    var set = function(id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('result-profit-per-kit', fmt(profit));
    set('result-total-kits', kits.toLocaleString());
    set('result-total-revenue', fmt(rev));
    set('result-3m-revenue', fmt(Math.round(rev / 4)));
    set('result-6m-revenue', fmt(Math.round(rev / 2)));
    set('result-per-week', Math.max(1, Math.round(kits / 52)));
    set('result-total-profit', fmt(total));
  }

  function updateDisplay(slider) {
    var id = slider.id;
    var val = slider.value;
    // Find the value display — try both class names
    var container = slider.closest('.dental-calc-input');
    if (!container) return;
    var display = container.querySelector('.dental-calc-input__value') || container.querySelector('.dental-calc-value');
    if (!display) return;
    if (id === 'resale-price') display.textContent = '$' + val;
    else if (id === 'bonus') display.textContent = '$' + parseFloat(val).toFixed(2);
    else if (id === 'conversion') display.textContent = val + '%';
    else display.textContent = Number(val).toLocaleString();
  }

  // Sliders
  document.querySelectorAll('.dental-calc-slider').forEach(function(s) {
    s.addEventListener('input', function() { updateDisplay(this); calc(); });
  });

  // Plus/minus buttons — match both old and new class names
  document.querySelectorAll('.dental-calc-btn, .dental-calc-input__btn-minus, .dental-calc-input__btn-plus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var container = this.closest('.dental-calc-input');
      if (!container) return;
      var slider = container.querySelector('.dental-calc-slider');
      if (!slider) return;
      var step = parseFloat(slider.step) || 1;
      var val = parseFloat(slider.value);
      var isPlus = this.classList.contains('dental-calc-input__btn-plus') || this.textContent.trim() === '+';
      if (isPlus) val += step; else val -= step;
      val = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), val));
      slider.value = val;
      updateDisplay(slider);
      calc();
    });
  });

  /* === Pricing Tier Selection === */
  document.querySelectorAll('.dental-pricing-tier').forEach(function(tier) {
    tier.addEventListener('click', function() {
      document.querySelectorAll('.dental-pricing-tier').forEach(function(t) {
        t.classList.remove('dental-pricing-tier--selected');
      });
      this.classList.add('dental-pricing-tier--selected');
    });
  });

  /* === Pricing Thumbnail Swap === */
  document.querySelectorAll('.dental-pricing__thumb').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      document.querySelectorAll('.dental-pricing__thumb').forEach(function(t) {
        t.classList.remove('dental-pricing__thumb--active');
      });
      this.classList.add('dental-pricing__thumb--active');
      var img = this.querySelector('img');
      var main = document.querySelector('.dental-pricing__main-image img');
      if (img && main) main.src = img.src.replace(/width=\d+/, 'width=1400');
    });
  });

  /* === FAQ Accordions === */
  document.querySelectorAll('.dental-faq-item__header').forEach(function(header) {
    header.addEventListener('click', function() {
      this.closest('.dental-faq-item').classList.toggle('dental-faq-item--open');
    });
  });

  /* === Scroll Animations === */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('do-animate--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.do-animate').forEach(function(el) {
      observer.observe(el);
    });
  }
});
