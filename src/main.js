import './style.css';

const tabs = [...document.querySelectorAll('.step-button')];
const panels = [...document.querySelectorAll('.stage-panel')];
const motionToggle = document.querySelector('#motion-toggle');
const stepCounter = document.querySelector('.stage-chrome__step');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activeStep = 0;
let paused = reducedMotion.matches;
let timer;

function stopTimer() {
  if (timer) window.clearInterval(timer);
  timer = undefined;
}

function showStep(index, focus = false) {
  activeStep = (index + tabs.length) % tabs.length;
  tabs.forEach((tab, i) => {
    const selected = i === activeStep;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[i].hidden = !selected;
    panels[i].classList.toggle('is-active', selected);
  });
  stepCounter.textContent = String(activeStep + 1).padStart(2, '0') + ' — 04';
  if (focus) tabs[activeStep].focus();
}

function updateToggle() {
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', paused ? 'Relancer l’animation' : 'Mettre l’animation en pause');
  motionToggle.innerHTML = paused ? 'Lecture <span aria-hidden="true">▶</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
}

function syncTimer() {
  stopTimer();
  if (!paused && !document.hidden) {
    timer = window.setInterval(() => showStep(activeStep + 1), 5600);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    paused = true;
    showStep(index);
    updateToggle();
    syncTimer();
  });
  tab.addEventListener('keydown', (event) => {
    const keys = { ArrowRight: activeStep + 1, ArrowDown: activeStep + 1, ArrowLeft: activeStep - 1, ArrowUp: activeStep - 1, Home: 0, End: tabs.length - 1 };
    if (Object.hasOwn(keys, event.key)) {
      event.preventDefault();
      paused = true;
      showStep(keys[event.key], true);
      updateToggle();
      syncTimer();
    }
  });
});

motionToggle.addEventListener('click', () => {
  paused = !paused;
  updateToggle();
  syncTimer();
});

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    paused = true;
    updateToggle();
    syncTimer();
  }
});

document.addEventListener('visibilitychange', syncTimer);

updateToggle();
syncTimer();
