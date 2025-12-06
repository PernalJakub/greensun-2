// ===== GALLERY MODULE =====
// Handles image carousel with multilingual captions

function initGalleryCarousel() {
  // Multilingual carousel data
  const carouselTranslations = {
      pl: [
          { t: 'Montaż od A do Z',        s: 'Prace ziemne po panele.' },
          { t: 'Farmy PV wodne',          s: 'Akweny: platformy i łączenia.' },
          { t: 'Farmy PV na gruncie',     s: 'Kafar + pre-drill; stoły i panele.' },
          { t: 'Dachy i carporty',        s: 'Także mniejsze inwestycje.' },
          { t: 'Prowadzenie projektów',   s: 'Każdy detal ma znaczenie.' }
          ],
      en: [
          { t: 'A–Z installation',        s: 'Earthworks to modules.' },
          { t: 'Floating PV farms',       s: 'Water: platforms & links.' },
          { t: 'Ground-mounted PV farms', s: 'Ground: piles, tables, modules.' },
          { t: 'Roofs & carports',        s: 'Also smaller projects.' },
          { t: 'Project delivery',        s: 'Every detail matters.' }
          ],
      fr: [
          { t: 'Montage de A à Z',        s: 'Terrassements aux modules.' },
          { t: 'Fermes PV flottantes',    s: 'Sur l’eau : plateformes & raccords.' },
          { t: 'Fermes PV terrestres',    s: 'Terre : pieux, tables, modules.' },
          { t: 'Toitures & carports',     s: 'Aussi les petits projets.' },
          { t: 'Pilotage de projets',     s: 'Chaque détail compte.' }
          ] 
  };

  const carouselImages = [
    './media/gallery/Montage de A a Z.jpg',
    './media/gallery/Fermes PV flottantes.jpeg',
    './media/gallery/Fermes PV terrestres.jpg',
    './media/gallery/Toitures & carports.jpg',
    './media/gallery/Conduite de projets professionnelle.jpg'
  ];

  // Get current language carousel data
  function getCarouselData() {
    const lang = (window.languageModule ? window.languageModule.currentLanguage : null) || 'pl';
    const texts = carouselTranslations[lang] || carouselTranslations.pl;
    return texts.map((text, index) => ({
      src: carouselImages[index],
      title: text.t,
      subtitle: text.s
    }));
  }

  let carouselData = getCarouselData();

  let currentActiveIndex = 7; // Desktop: Start with middle tile active (index 7 out of 0-14)

  const tiles = document.querySelectorAll('.carousel-tile');
  const dotsContainer = document.querySelector('.carousel-dots');
  const carouselContainer = document.querySelector('.carousel-container');
  const isMobile = window.innerWidth <= 1024;

  // Initialize tiles with images and captions
  function initTiles() {
    tiles.forEach((tile, index) => {
      const dataIndex = index % carouselData.length;
      const data = carouselData[dataIndex];

      // Set background image
      tile.style.backgroundImage = `url('${data.src}')`;

      // Add caption
      const caption = document.createElement('div');
      caption.className = 'carousel-tile-caption';
      caption.innerHTML = `
        <div class="carousel-tile-title">${data.title}</div>
        <div class="carousel-tile-subtitle">${data.subtitle}</div>
      `;
      tile.appendChild(caption);

      // Store data index
      tile.dataset.dataIndex = dataIndex;

      // Click handler
      tile.addEventListener('click', () => {
        if (!tile.classList.contains('active')) {
          if (isMobile) {
            // Mobile: Scroll tile to center
            tile.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          } else {
            // Desktop: Use setActiveTile
            setActiveTile(index);
          }
        }
      });
    });
  }

  // Initialize dots
  function initDots() {
    dotsContainer.innerHTML = carouselData.map((_, index) =>
      `<button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
    ).join('');

    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        goToDataIndex(parseInt(dot.dataset.index));
      });
    });
  }

  // Update carousel captions when language changes
  function updateCarouselLanguage() {
    carouselData = getCarouselData();
    tiles.forEach((tile, index) => {
      const dataIndex = parseInt(tile.dataset.dataIndex);
      if (dataIndex >= 0 && dataIndex < carouselData.length) {
        const data = carouselData[dataIndex];
        const caption = tile.querySelector('.carousel-tile-caption');
        if (caption) {
          caption.innerHTML = `
            <div class="carousel-tile-title">${data.title}</div>
            <div class="carousel-tile-subtitle">${data.subtitle}</div>
          `;
        }
      }
    });
  }

  // Expose update function globally
  window.updateCarouselLanguage = updateCarouselLanguage;

  // Set active tile by tile position (0-3)
  function setActiveTile(tileIndex) {
    // Remove active from all tiles
    tiles.forEach(tile => tile.classList.remove('active'));

    // Add active to selected tile
    tiles[tileIndex].classList.add('active');

    // Update current active index
    currentActiveIndex = tileIndex;

    // Update dots based on data index
    updateDots();
  }

  // Go to specific data index (from dots)
  function goToDataIndex(dataIndex) {
    // Find which tile currently shows this data
    let targetTileIndex = -1;
    tiles.forEach((tile, index) => {
      if (parseInt(tile.dataset.dataIndex) === dataIndex) {
        targetTileIndex = index;
      }
    });

    if (targetTileIndex !== -1) {
      if (isMobile) {
        // Mobile: Scroll tile to center
        tiles[targetTileIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } else {
        // Desktop: Use setActiveTile
        if (targetTileIndex !== currentActiveIndex) {
          setActiveTile(targetTileIndex);
        }
      }
    }
  }

  // Update dots based on active tile's data index
  function updateDots() {
    if (isMobile) {
      // Mobile: Find which tile is currently centered
      const containerRect = carouselContainer.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      let closestTile = null;
      let closestDistance = Infinity;

      tiles.forEach(tile => {
        // Skip if tile doesn't have a data-index (padding tiles don't have this)
        if (!tile.dataset.dataIndex) return;

        const tileRect = tile.getBoundingClientRect();
        const tileCenterX = tileRect.left + tileRect.width / 2;
        const distance = Math.abs(tileCenterX - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestTile = tile;
        }
      });

      if (!closestTile) return; // Safety check

      // Update active class on tiles
      tiles.forEach(tile => {
        tile.classList.toggle('active', tile === closestTile);
      });

      // Update dots - remove all active first, then add to correct one
      const activeDataIndex = parseInt(closestTile.dataset.dataIndex);
      const allDots = document.querySelectorAll('.carousel-dot');
      allDots.forEach(dot => dot.classList.remove('active'));
      if (allDots[activeDataIndex]) {
        allDots[activeDataIndex].classList.add('active');
      }
    } else {
      // Desktop: Use currentActiveIndex
      const activeDataIndex = parseInt(tiles[currentActiveIndex].dataset.dataIndex);
      document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDataIndex);
      });
    }
  }

  // Navigate next
  function nextSlide() {
    // Rotate tiles: move last tile's data to first, shift all data right
    const lastTileData = tiles[4].dataset.dataIndex;

    // Shift data from right to left
    for (let i = 4; i > 0; i--) {
      tiles[i].dataset.dataIndex = tiles[i - 1].dataset.dataIndex;
      tiles[i].style.backgroundImage = tiles[i - 1].style.backgroundImage;

      const caption = tiles[i].querySelector('.carousel-tile-caption');
      const prevCaption = tiles[i - 1].querySelector('.carousel-tile-caption');
      if (caption && prevCaption) {
        caption.innerHTML = prevCaption.innerHTML;
      }
    }

    // Set first tile with next data in sequence
    const newDataIndex = (parseInt(lastTileData) + 1) % carouselData.length;
    const newData = carouselData[newDataIndex];
    tiles[0].dataset.dataIndex = newDataIndex;
    tiles[0].style.backgroundImage = `url('${newData.src}')`;

    const firstCaption = tiles[0].querySelector('.carousel-tile-caption');
    if (firstCaption) {
      firstCaption.innerHTML = `
        <div class="carousel-tile-title">${newData.title}</div>
        <div class="carousel-tile-subtitle">${newData.subtitle}</div>
      `;
    }

    // Keep active tile at same position (visual stays in center)
    updateDots();
  }

  // Navigate previous
  function prevSlide() {
    // Rotate tiles: move first tile's data to last, shift all data left
    const firstTileData = tiles[0].dataset.dataIndex;

    // Shift data from left to right
    for (let i = 0; i < 4; i++) {
      tiles[i].dataset.dataIndex = tiles[i + 1].dataset.dataIndex;
      tiles[i].style.backgroundImage = tiles[i + 1].style.backgroundImage;

      const caption = tiles[i].querySelector('.carousel-tile-caption');
      const nextCaption = tiles[i + 1].querySelector('.carousel-tile-caption');
      if (caption && nextCaption) {
        caption.innerHTML = nextCaption.innerHTML;
      }
    }

    // Set last tile with previous data in sequence
    const newDataIndex = (parseInt(firstTileData) - 1 + carouselData.length) % carouselData.length;
    const newData = carouselData[newDataIndex];
    tiles[4].dataset.dataIndex = newDataIndex;
    tiles[4].style.backgroundImage = `url('${newData.src}')`;

    const lastCaption = tiles[4].querySelector('.carousel-tile-caption');
    if (lastCaption) {
      lastCaption.innerHTML = `
        <div class="carousel-tile-title">${newData.title}</div>
        <div class="carousel-tile-subtitle">${newData.subtitle}</div>
      `;
    }

    // Keep active tile at same position
    updateDots();
  }

  // Desktop only: Keyboard navigation
  if (!isMobile) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
  }

  // Mobile: Simple horizontal scroll with auto-centering
  if (isMobile && carouselContainer) {
    let scrollTimeout;

    // Set initial scroll position immediately (before carousel is visible)
    // This prevents the jump when user scrolls to the gallery
    setTimeout(() => {
      if (tiles[7]) {
        const middleTile = tiles[7];
        const containerWidth = carouselContainer.offsetWidth;
        const tileWidth = 304;
        const centerOffset = (containerWidth / 2) - (tileWidth / 2);

        // Set scroll position without animation to center the middle tile
        const middleTileOffset = middleTile.offsetLeft;
        carouselContainer.scrollLeft = middleTileOffset - centerOffset;

        // Update dots after initial positioning
        setTimeout(() => updateDots(), 50);
      }
    }, 0);

    // Update dots when scrolling - use multiple timeouts to catch the snap
    let scrollTimeout1, scrollTimeout2;

    carouselContainer.addEventListener('scroll', () => {
      // Quick update
      clearTimeout(scrollTimeout1);
      scrollTimeout1 = setTimeout(() => {
        updateDots();
      }, 0);

      // Delayed update to catch snap completion
      clearTimeout(scrollTimeout2);
      scrollTimeout2 = setTimeout(() => {
        updateDots();
      }, 300);
    }, { passive: true });

    // Also use scrollend if available (modern browsers)
    if ('onscrollend' in window) {
      carouselContainer.addEventListener('scrollend', () => {
        updateDots();
      }, { passive: true });
    }
  }

  // Initialize
  initTiles();
  initDots();
  updateDots();
}

window.galleryModule = {
  initGalleryCarousel
};
