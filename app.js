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

});
