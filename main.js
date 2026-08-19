document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ MOBILE NAV TOGGLE ============ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ============ MAJOR PROJECTS DROPDOWN ============ */
  const dropdown = document.getElementById('projectsDropdown');
  const dropdownTrigger = dropdown.querySelector('.dropdown-trigger');

  function closeDropdown(){
    dropdown.classList.remove('open');
    dropdownTrigger.setAttribute('aria-expanded', 'false');
  }
  function toggleDropdown(){
    const isOpen = dropdown.classList.toggle('open');
    dropdownTrigger.setAttribute('aria-expanded', isOpen);
  }

  dropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  // desktop hover convenience
  if (window.matchMedia('(hover: hover)').matches) {
    dropdown.addEventListener('mouseenter', () => dropdown.classList.add('open'));
    dropdown.addEventListener('mouseleave', closeDropdown);
  }
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  /* ============ CLOSE MOBILE MENU ON LINK CLICK ============ */
  document.querySelectorAll('.nav-scroll').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ MAJOR PROJECTS — CARD STACK SCROLL EFFECT ============ */
  const stackCards = Array.from(document.querySelectorAll('.stack-card'));
  const STICKY_TOP = 100; // must match CSS `top` value on .stack-card

  function updateStack(){
    stackCards.forEach((card, i) => {
      const next = stackCards[i + 1];
      if (!next) return; // last card never shrinks
      const nextRect = next.getBoundingClientRect();
      const start = window.innerHeight;     // next card enters from bottom of viewport
      const end = STICKY_TOP;               // next card reaches its pinned position

      let progress = (start - nextRect.top) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);

      const scale = 1 - progress * 0.06;
      const translateY = -progress * 22;
      const brightness = 1 - progress * 0.25;

      card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      card.style.filter = `brightness(${brightness})`;
    });
  }

  let stackTicking = false;
  function onScrollStack(){
    if (!stackTicking){
      window.requestAnimationFrame(() => { updateStack(); stackTicking = false; });
      stackTicking = true;
    }
  }
  if (stackCards.length && !reduceMotion){
    window.addEventListener('scroll', onScrollStack, { passive: true });
    window.addEventListener('resize', onScrollStack);
    updateStack();
  }

  /* ============ MINOR PROJECTS MARQUEE — clone + pause on hover ============ */
  const minorMarquee = document.getElementById('minorMarquee');
  const minorTrack = document.getElementById('minorTrack');
  if (minorTrack){
    // duplicate the cards so the loop is seamless
    minorTrack.innerHTML += minorTrack.innerHTML;

    minorMarquee.addEventListener('mouseenter', () => minorTrack.classList.add('paused'));
    minorMarquee.addEventListener('mouseleave', () => minorTrack.classList.remove('paused'));
    // touch devices: tap pauses briefly via focus/hover fallback already covered by CSS :hover
  }

  /* ============ TECH STACK MARQUEE — clone only, always running ============ */
  const techTrack = document.getElementById('techTrack');
  if (techTrack){
    techTrack.innerHTML += techTrack.innerHTML;
  }

  /* ============ BEYOND CODE — PARALLAX ============ */
  const parallaxBg = document.getElementById('parallaxBg');
  const beyondSection = document.querySelector('.beyond-code');
  const parallaxItems = document.querySelectorAll('[data-parallax-speed]');

  function updateParallax(){
    if (!beyondSection) return;
    const rect = beyondSection.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

    if (parallaxBg){
      parallaxBg.style.transform = `translateY(${(progress - 0.5) * 60}px)`;
    }
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.parallaxSpeed) || 0;
      const offset = (progress - 0.5) * 100 * speed * 10;
      item.style.transform = `translateY(${offset}px)`;
    });
  }

  let parallaxTicking = false;
  function onScrollParallax(){
    if (!parallaxTicking){
      window.requestAnimationFrame(() => { updateParallax(); parallaxTicking = false; });
      parallaxTicking = true;
    }
  }
  if (beyondSection && !reduceMotion){
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    window.addEventListener('resize', onScrollParallax);
    updateParallax();
  }

  /* ============ COPY EMAIL TO CLIPBOARD ============ */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyTooltip = document.getElementById('copyTooltip');

  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      // fallback for older browsers
      const temp = document.createElement('textarea');
      temp.value = email;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    copyTooltip.classList.add('show');
    setTimeout(() => copyTooltip.classList.remove('show'), 1600);
  });

});
