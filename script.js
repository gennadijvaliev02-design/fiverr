const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const toast = document.getElementById('toast');

header.classList.toggle('scrolled', window.scrollY > 18);
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 18), { passive: true });

function closeMenu() {
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const open = !siteNav.classList.contains('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href');
    if (target === '#') {
      event.preventDefault();
      showToast(`${link.dataset.placeholder || 'This'} link is a placeholder for the final profile URL.`);
      return;
    }
    closeMenu();
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const booking = {
  step: 1,
  service: '',
  price: '',
  duration: '',
  specialist: '',
  date: null,
  time: ''
};

const stepTitles = ['Choose a service', 'Choose a professional', 'Select a date', 'Choose a time', 'Your details'];
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const progress = document.getElementById('booking-progress');
const bookingForm = document.getElementById('booking-form');
const successState = document.getElementById('success-state');
const appointmentSummary = document.getElementById('appointment-summary');
const formError = document.getElementById('form-error');

function goToStep(step) {
  booking.step = step;
  document.querySelectorAll('.booking-step').forEach((panel) => panel.classList.toggle('active', Number(panel.dataset.step) === step));
  successState.classList.remove('active');
  stepNumber.textContent = step;
  stepTitle.textContent = stepTitles[step - 1];
  progress.style.width = `${step * 20}%`;
  if (step === 5) renderAppointmentSummary();
}

function selectAndContinue(containerId, callback, nextStep) {
  document.getElementById(containerId).addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button) return;
    document.querySelectorAll(`#${containerId} button`).forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    callback(button);
    window.setTimeout(() => goToStep(nextStep), 180);
  });
}

selectAndContinue('service-options', (button) => {
  booking.service = button.dataset.value;
  booking.price = button.dataset.price;
  booking.duration = button.dataset.duration;
}, 2);

selectAndContinue('specialist-options', (button) => {
  booking.specialist = button.dataset.value;
}, 3);

selectAndContinue('time-options', (button) => {
  booking.time = button.dataset.value;
}, 5);

let viewedMonth = new Date();
viewedMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1);
const monthLabel = document.getElementById('month-label');
const calendarDays = document.getElementById('calendar-days');

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function renderCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const dayCount = new Date(year, month + 1, 0).getDate();
  monthLabel.textContent = viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  calendarDays.innerHTML = '';
  for (let i = 0; i < firstDay; i += 1) calendarDays.append(document.createElement('span'));
  for (let day = 1; day <= dayCount; day += 1) {
    const date = new Date(year, month, day);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = day;
    button.disabled = date < today || date.getDay() === 0;
    button.classList.toggle('today', sameDay(date, today));
    button.classList.toggle('selected', sameDay(date, booking.date));
    button.setAttribute('aria-label', date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    button.addEventListener('click', () => {
      booking.date = date;
      renderCalendar();
      document.getElementById('selected-day-label').textContent = `Available times for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
      window.setTimeout(() => goToStep(4), 180);
    });
    calendarDays.append(button);
  }
}

document.getElementById('prev-month').addEventListener('click', () => {
  const now = new Date();
  const earliest = new Date(now.getFullYear(), now.getMonth(), 1);
  const previous = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1);
  if (previous >= earliest) viewedMonth = previous;
  renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
  viewedMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1);
  renderCalendar();
});

function renderAppointmentSummary() {
  const date = booking.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  appointmentSummary.innerHTML = `<span>${booking.service} · ${booking.price}</span><span>${booking.specialist}</span><span>${date} · ${booking.time}</span>`;
}

function resetBooking() {
  Object.assign(booking, { step: 1, service: '', price: '', duration: '', specialist: '', date: null, time: '' });
  bookingForm.reset();
  formError.textContent = '';
  document.querySelectorAll('.selected').forEach((item) => item.classList.remove('selected'));
  document.querySelector('.booking-head').style.display = '';
  document.querySelector('.progress-track').style.display = '';
  goToStep(1);
  renderCalendar();
}

document.getElementById('booking-reset').addEventListener('click', resetBooking);
document.getElementById('book-another').addEventListener('click', resetBooking);

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  if (name.length < 2 || phone.replace(/\D/g, '').length < 7) {
    formError.textContent = 'Please enter your name and a valid phone number.';
    return;
  }
  formError.textContent = '';

  // FUTURE WEBHOOK INTEGRATION:
  // fetch('YOUR_WEBHOOK_URL', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...booking, name, phone }) });

  document.querySelectorAll('.booking-step').forEach((panel) => panel.classList.remove('active'));
  document.querySelector('.booking-head').style.display = 'none';
  document.querySelector('.progress-track').style.display = 'none';
  document.getElementById('success-summary').textContent = `${booking.service} with ${booking.specialist} · ${booking.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${booking.time}`;
  successState.classList.add('active');
});

document.getElementById('current-year').textContent = new Date().getFullYear();
renderCalendar();


const contactTrigger = document.getElementById('contact-trigger');
const contactModal = document.getElementById('contact-modal');

function closeContactModal() {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

contactTrigger.addEventListener('click', () => {
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
});

contactModal.querySelectorAll('[data-contact-close]').forEach((element) => {
  element.addEventListener('click', closeContactModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal.classList.contains('open')) closeContactModal();
});

const robotViewer = document.getElementById('robot-model');
const robotStage = document.querySelector('.robot-stage');
const robotMessageText = document.querySelector('.robot-message-text');

if (robotViewer && robotStage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseOrbit = { theta: 69, phi: 82 };
  let pointerX = 0;
  let pointerY = 0;
  let currentTheta = baseOrbit.theta;
  let currentPhi = baseOrbit.phi;
  let lightsOn = false;
  let lastOrbitUpdate = 0;

  function setMaterialLight(material, color, emissive, strength) {
    if (!material) return;
    material.pbrMetallicRoughness.setBaseColorFactor(color);
    material.setEmissiveFactor(emissive);
    if (typeof material.setEmissiveStrength === 'function') material.setEmissiveStrength(strength);
  }

  function setRobotLights(active) {
    const bodyLight = robotViewer.model?.getMaterialByName('Body light');
    const ears = robotViewer.model?.getMaterialByName('Warm earpieces');
    if (!bodyLight || !ears) return;

    lightsOn = active;
    if (active) {
      setMaterialLight(bodyLight, '#ff294d', '#ff082a', 4);
      setMaterialLight(ears, '#61e7ff', '#24c8ed', 2.6);
      robotMessageText.textContent = 'Systems glowing';
    } else {
      setMaterialLight(bodyLight, '#05080d', '#000000', 1);
      setMaterialLight(ears, '#6e5149', '#000000', 1);
      robotMessageText.textContent = 'Your digital guide';
    }
    robotStage.classList.toggle('lights-on', active);
  }

  robotViewer.addEventListener('click', (event) => {
    if (!robotViewer.modelIsVisible || typeof robotViewer.materialFromPoint !== 'function') return;
    const material = robotViewer.materialFromPoint(event.clientX, event.clientY);
    if (material) setRobotLights(!lightsOn);
  });

  robotViewer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setRobotLights(!lightsOn);
    }
  });

  robotStage.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = robotStage.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  });

  robotStage.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
  });

  function animateRobot(time) {
    if (time - lastOrbitUpdate > 45) {
      const idleTheta = reducedMotion ? 0 : Math.sin(time / 1700) * 1.8;
      const idlePhi = reducedMotion ? 0 : Math.sin(time / 2200) * 0.8;
      const targetTheta = baseOrbit.theta + idleTheta + pointerX * 6;
      const targetPhi = baseOrbit.phi + idlePhi + pointerY * 2.8;
      currentTheta += (targetTheta - currentTheta) * 0.16;
      currentPhi += (targetPhi - currentPhi) * 0.16;
      robotViewer.cameraOrbit = `${currentTheta.toFixed(2)}deg ${currentPhi.toFixed(2)}deg 105%`;
      lastOrbitUpdate = time;
    }
    window.requestAnimationFrame(animateRobot);
  }

  window.requestAnimationFrame(animateRobot);
}
