(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  /* Theme toggle */
  var KEY = 'ds-theme';
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    var b = document.querySelector('.theme-toggle');
    if (b) b.setAttribute('aria-label', t === 'dark' ? '주간 모드로 전환' : '야간 모드로 전환');
  }
  var tbtn = document.querySelector('.theme-toggle');
  if (tbtn) {
    tbtn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? '주간 모드로 전환' : '야간 모드로 전환');
    tbtn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var follow = function (e) {
      var saved = null;
      try { saved = localStorage.getItem(KEY); } catch (err) {}
      if (!saved) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', follow);
  }

  /* Mobile menu */
  var mbtn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (mbtn && nav) {
    mbtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); mbtn.focus(); }
    });
  }

  /* Reveal on scroll */
  var els = document.querySelectorAll('.reveal, .scale');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* Signature: DX -> AX shift */
  var shift = document.querySelector('.shift');
  if (shift) {
    var cap = shift.querySelector('.shift__caption');
    var from = cap ? cap.getAttribute('data-from') : '';
    var to = cap ? cap.getAttribute('data-to') : '';
    var run = function () {
      shift.classList.remove('is-shifted');
      if (cap) cap.innerHTML = from;
      setTimeout(function () {
        shift.classList.add('is-shifted');
        if (cap) cap.innerHTML = to;
      }, 900);
    };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { shift.classList.add('is-shifted'); if (cap) cap.innerHTML = to; }
    else { run(); }
    var rb = shift.querySelector('.shift__replay');
    if (rb) rb.addEventListener('click', run);
  }

  /* Hero: D -> A flip in headline */
  var hero = document.querySelector('.hero');
  if (hero && hero.querySelector('.flip')) {
    var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) hero.classList.add('is-shifted');
    else setTimeout(function () { hero.classList.add('is-shifted'); }, 1300);
  }

  /* Marquee: duplicate logos for a seamless loop */
  document.querySelectorAll('.marquee__track').forEach(function (t) {
    var kids = Array.prototype.slice.call(t.children);
    kids.forEach(function (k) { var c = k.cloneNode(true); c.setAttribute('aria-hidden', 'true'); var im = c.querySelector('img'); if (im) im.alt = ''; t.appendChild(c); });
  });

  /* Collapsible long lists */
  document.querySelectorAll('[data-collapse]').forEach(function (btn) {
    var list = document.querySelector(btn.getAttribute('data-collapse'));
    if (!list) return;
    var total = list.children.length;
    if (total <= 12) { btn.hidden = true; return; }
    list.classList.add('is-collapsed');
    btn.textContent = '전체 ' + total + '개 과정 보기';
    btn.addEventListener('click', function () {
      var c = list.classList.toggle('is-collapsed');
      btn.textContent = c ? '전체 ' + total + '개 과정 보기' : '접기';
      btn.setAttribute('aria-expanded', c ? 'false' : 'true');
    });
  });

  /* Filter chips (lecture history) */
  var filters = document.querySelectorAll('[data-filter-group]');
  filters.forEach(function (group) {
    var target = document.querySelector(group.getAttribute('data-filter-group'));
    if (!target) return;
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      group.querySelectorAll('button[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var f = btn.getAttribute('data-filter');
      var mb = document.querySelector('[data-collapse="' + group.getAttribute('data-filter-group') + '"]');
      if (mb) {
        if (f === 'all') { target.classList.add('is-collapsed'); mb.hidden = false; mb.textContent = '전체 ' + target.children.length + '개 과정 보기'; }
        else { target.classList.remove('is-collapsed'); mb.hidden = true; }
      }
      target.querySelectorAll('[data-cat]').forEach(function (row) {
        row.hidden = !(f === 'all' || row.getAttribute('data-cat').split(' ').indexOf(f) > -1);
      });
    });
  });

  /* Lightbox for captures */
  var shots = document.querySelectorAll('.shot');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', '이미지 확대 보기');
    lb.innerHTML = '<button type="button" aria-label="닫기">&times;</button><figure style="margin:0"><img alt=""><p></p></figure>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), lbBtn = lb.querySelector('button');
    var last = null;
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); };
    shots.forEach(function (s) {
      s.setAttribute('tabindex', '0');
      s.setAttribute('role', 'button');
      var open = function () {
        var img = s.querySelector('img');
        lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt;
        lb.classList.add('open'); document.body.style.overflow = 'hidden'; last = s; lbBtn.focus();
      };
      s.addEventListener('click', open);
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }

  /* Contact form -> mail client */
  var form = document.getElementById('inquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var type = fd.get('type') || '';
      var subject = '[' + type + '] ' + (fd.get('org') || '') + ' 문의';
      var body = [
        '문의 유형: ' + type,
        '기관/회사: ' + (fd.get('org') || ''),
        '담당자: ' + (fd.get('name') || ''),
        '연락처: ' + (fd.get('phone') || ''),
        '이메일: ' + (fd.get('email') || ''),
        '희망 기간: ' + (fd.get('length') || ''),
        '교육 대상/인원: ' + (fd.get('target') || ''),
        '',
        '내용:',
        fd.get('message') || ''
      ].join('\n');
      var to = form.getAttribute('data-to');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = document.getElementById('form-status');
      if (note) note.textContent = '메일 앱이 열리면 내용을 확인하고 보내기를 눌러 주세요. 메일 앱이 열리지 않으면 ' + to + ' 로 직접 보내 주세요.';
    });
  }

  /* Year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
