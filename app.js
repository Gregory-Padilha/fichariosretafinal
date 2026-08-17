document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. DATA DINÂMICA DO DIA (Header & Seção de Oferta)
     ========================================================================== */
  const dynamicDateElement = document.getElementById('dynamic-date');
  const pricingDynamicDateElement = document.getElementById('pricing-dynamic-date');

  if (dynamicDateElement || pricingDynamicDateElement) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day} - ${month} - ${year}`;

    if (dynamicDateElement) dynamicDateElement.textContent = formattedDate;
    if (pricingDynamicDateElement) pricingDynamicDateElement.textContent = formattedDate;
  }

  /* ==========================================================================
     2. FLASHCARD SIMULATOR TAB SWITCHER
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const flashcardSamples = document.querySelectorAll('.flashcard-sample');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const subject = button.getAttribute('data-subject');

      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Show corresponding sample card
      flashcardSamples.forEach(sample => {
        sample.classList.remove('active');
        if (sample.id === `card-${subject}`) {
          sample.classList.add('active');
        }
      });
    });
  });

  /* ==========================================================================
     3. FAQ ACCORDION (Mobile Touch Optimized)
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all open items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. STICKY BOTTOM BAR (Mobile Scroll Trigger)
     ========================================================================== */
  const stickyBar = document.getElementById('stickyBar');

  if (stickyBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        stickyBar.classList.add('show');
      } else {
        stickyBar.classList.remove('show');
      }
    });
  }

  /* ==========================================================================
     5. HERO VSL VIDEO PLAYER (Unmuted Autoplay & Replay Overlay)
     ========================================================================== */
  const vslVideo = document.getElementById('vslVideo');
  const vslContainer = document.getElementById('vslVideoContainer');
  const vslPlayPauseBtn = document.getElementById('vslPlayPauseBtn');
  const vslReplayOverlay = document.getElementById('vslReplayOverlay');
  const vslReplayBtn = document.getElementById('vslReplayBtn');

  if (vslVideo && vslContainer) {
    const iconPlay = vslPlayPauseBtn ? vslPlayPauseBtn.querySelector('.icon-play') : null;
    const iconPause = vslPlayPauseBtn ? vslPlayPauseBtn.querySelector('.icon-pause') : null;
    let hideTimeout;

    // Attempt unmuted autoplay
    vslVideo.muted = false;
    vslVideo.volume = 1.0;

    const playPromise = vslVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Unmuted autoplay prevented by browser policy, falling back to muted autoplay:', err);
        vslVideo.muted = true;
        vslVideo.play().catch(() => {});

        // Unmute on first user click anywhere on page
        const unmuteOnInteraction = () => {
          vslVideo.muted = false;
          vslVideo.volume = 1.0;
          document.removeEventListener('click', unmuteOnInteraction);
          document.removeEventListener('touchstart', unmuteOnInteraction);
        };
        document.addEventListener('click', unmuteOnInteraction, { once: true });
        document.addEventListener('touchstart', unmuteOnInteraction, { once: true });
      });
    }

    const showOverlayTemporarily = () => {
      if (!vslPlayPauseBtn) return;
      vslPlayPauseBtn.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!vslVideo.paused) {
          vslPlayPauseBtn.classList.remove('visible');
        }
      }, 1600);
    };

    // Toggle Play/Pause on Video Click
    vslContainer.addEventListener('click', (e) => {
      if (e.target.closest('#vslReplayBtn') || e.target.closest('#vslReplayOverlay')) return;

      // Always ensure sound is unmuted on tap
      vslVideo.muted = false;
      vslVideo.volume = 1.0;

      if (vslVideo.ended) return;

      if (vslVideo.paused) {
        vslVideo.play();
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
        showOverlayTemporarily();
      } else {
        vslVideo.pause();
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
        if (vslPlayPauseBtn) vslPlayPauseBtn.classList.add('visible');
      }
    });

    // Show Replay Overlay when video finishes
    vslVideo.addEventListener('ended', () => {
      if (vslPlayPauseBtn) vslPlayPauseBtn.classList.remove('visible');
      if (vslReplayOverlay) vslReplayOverlay.classList.add('show');
    });

    // Handle Replay Button Click
    if (vslReplayBtn) {
      vslReplayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (vslReplayOverlay) vslReplayOverlay.classList.remove('show');
        vslVideo.currentTime = 0;
        vslVideo.muted = false;
        vslVideo.volume = 1.0;
        vslVideo.play();
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
        showOverlayTemporarily();
      });
    }
  }

  /* ==========================================================================
     6. THANK YOU PAGE: COPY EMAIL TO CLIPBOARD & TOAST
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const supportEmail = document.getElementById('supportEmail');
  const copyBtnText = document.getElementById('copyBtnText');
  const toastNotification = document.getElementById('toastNotification');

  if (copyEmailBtn && supportEmail) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = supportEmail.textContent.trim();

      navigator.clipboard.writeText(emailText).then(() => {
        // Button Feedback
        copyEmailBtn.classList.add('copied');
        if (copyBtnText) copyBtnText.textContent = 'Copiado! ✅';

        // Toast Feedback
        if (toastNotification) {
          toastNotification.classList.add('show');
          setTimeout(() => {
            toastNotification.classList.remove('show');
          }, 3000);
        }

        // Reset button after 3 seconds
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyBtnText) copyBtnText.textContent = 'Copiar E-mail';
        }, 3000);
      }).catch(err => {
        console.error('Falha ao copiar e-mail:', err);
      });
    });
  }

  /* ==========================================================================
     7. UPSELL PAGE: COUNTDOWN TIMER (10 MINUTES)
     ========================================================================== */
  const countdownElement = document.getElementById('upsell-countdown');
  if (countdownElement) {
    let totalSeconds = 10 * 60; // 10 minutes

    const updateTimer = () => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedMin = String(minutes).padStart(2, '0');
      const formattedSec = String(seconds).padStart(2, '0');
      countdownElement.textContent = `${formattedMin}:${formattedSec}`;

      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(timerInterval);
        countdownElement.textContent = "00:00";
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     8. DOWNSELL PAGE: COUNTDOWN TIMER (5 MINUTES)
     ========================================================================== */
  const downsellCountdownElement = document.getElementById('downsell-countdown');
  if (downsellCountdownElement) {
    let downsellTotalSeconds = 5 * 60; // 5 minutes

    const updateDownsellTimer = () => {
      const minutes = Math.floor(downsellTotalSeconds / 60);
      const seconds = downsellTotalSeconds % 60;
      const formattedMin = String(minutes).padStart(2, '0');
      const formattedSec = String(seconds).padStart(2, '0');
      downsellCountdownElement.textContent = `${formattedMin}:${formattedSec}`;

      if (downsellTotalSeconds > 0) {
        downsellTotalSeconds--;
      } else {
        clearInterval(downsellTimerInterval);
        downsellCountdownElement.textContent = "00:00";
      }
    };

    updateDownsellTimer();
    const downsellTimerInterval = setInterval(updateDownsellTimer, 1000);
  }

  /* Footer dynamic year update */
  const yearCopy = document.getElementById('year-copy');
  if (yearCopy) {
    yearCopy.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     9. UPGRADE INTERCEPT MODAL (Pop-up ao Clicar na Opção Básica R$ 9,90)
     ========================================================================== */
  const basicPlanBtn = document.getElementById('basicPlanBtn');
  const upgradeModal = document.getElementById('upgradeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (basicPlanBtn && upgradeModal) {
    // Interceptar clique no botão R$ 9,90
    basicPlanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      upgradeModal.classList.add('active');
      upgradeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const hideModal = () => {
      upgradeModal.classList.remove('active');
      upgradeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Botão X de fechar
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', hideModal);
    }

    // Clicar fora do modal card (backdrop overlay)
    upgradeModal.addEventListener('click', (e) => {
      if (e.target === upgradeModal) {
        hideModal();
      }
    });

    // Tecla ESC fecha modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && upgradeModal.classList.contains('active')) {
        hideModal();
      }
    });
  }

});



