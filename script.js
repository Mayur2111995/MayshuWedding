// Countdown to Vaidik Wedding: 19 Dec 2026, 12:46 PM IST
(function () {
  var target = new Date('2026-12-19T12:46:00+05:30').getTime();
  var el = {
    d: document.getElementById('d'),
    h: document.getElementById('h'),
    m: document.getElementById('m'),
    s: document.getElementById('s')
  };
  var box = document.getElementById('countdown');
  var note = document.getElementById('countNote');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      box.style.display = 'none';
      note.textContent = 'The celebrations have begun. Thank you for being a part of our day!';
      return;
    }
    el.d.textContent = Math.floor(diff / 864e5);
    el.h.textContent = pad(Math.floor(diff % 864e5 / 36e5));
    el.m.textContent = pad(Math.floor(diff % 36e5 / 6e4));
    el.s.textContent = pad(Math.floor(diff % 6e4 / 1e3));
    setTimeout(tick, 1000);
  }
  tick();
})();

// ---------------- Guest gate + music ----------------
// Paste your Google Apps Script Web App URL here (see README). Leave empty to skip saving.
var APPS_SCRIPT_URL = '';

(function () {
  var body = document.body;
  var gate = document.getElementById('gate');
  var form = document.getElementById('gateForm');
  var err = document.getElementById('gateError');
  var btn = document.getElementById('gateBtn');
  var audio = document.getElementById('bgm');
  var mBtn = document.getElementById('musicBtn');
  var icon = document.getElementById('musicIcon');
  var PLAY = 'M8 5v14l11-7z';
  var PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z';

  function setIcon(playing) {
    icon.setAttribute('d', playing ? PAUSE : PLAY);
    mBtn.classList.toggle('playing', playing);
  }
  function playMusic() {
    var p = audio.play();
    if (p && p.then) { p.then(function () { setIcon(true); }).catch(function () { setIcon(false); }); }
  }
  mBtn.addEventListener('click', function () {
    if (audio.paused) { playMusic(); } else { audio.pause(); setIcon(false); }
  });
  audio.addEventListener('error', function () { mBtn.style.display = 'none'; });

  // Returning visitor: gate already skipped, music starts on first tap
  if (body.classList.contains('ready')) {
    var first = function () { playMusic(); };
    document.addEventListener('click', first, { once: true });
    document.addEventListener('touchstart', first, { once: true });
    return;
  }

  function openInvite() {
    gate.classList.add('hide');
    body.classList.remove('locked');
    body.classList.add('ready');
    setTimeout(function () { gate.style.display = 'none'; }, 700);
    playMusic(); // allowed: triggered by the form submit tap
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var mobile = form.mobile.value.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
    var guests = form.guests.value;

    if (name.length < 2) { err.textContent = 'Please enter your name.'; form.name.focus(); return; }
    if (!/^[6-9]\d{9}$/.test(mobile)) { err.textContent = 'Please enter a valid 10-digit mobile number.'; form.mobile.focus(); return; }
    err.textContent = '';
    btn.disabled = true; btn.textContent = 'Opening...';

    try { localStorage.setItem('mayshuGuest', JSON.stringify({ name: name, mobile: mobile })); } catch (x) {}

    if (APPS_SCRIPT_URL) {
      var data = new URLSearchParams({ name: name, mobile: mobile, guests: guests });
      fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data })
        .catch(function () {})
        .then(openInvite);
      setTimeout(openInvite, 2500); // don't keep the guest waiting on a slow network
    } else {
      openInvite();
    }
  });

  setTimeout(function () { var n = document.getElementById('gName'); if (n) n.focus(); }, 300);
})();
