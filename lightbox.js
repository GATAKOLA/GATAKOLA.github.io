(() => {
  const images = [...document.querySelectorAll('main img')].filter((img) => !img.closest('a'));
  if (!images.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Просмотр изображения');
  overlay.innerHTML = `
    <button class="image-lightbox__close" type="button" aria-label="Закрыть увеличенное изображение">×</button>
    <div class="image-lightbox__content">
      <img class="image-lightbox__image" alt="">
      <div class="image-lightbox__caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const largeImage = overlay.querySelector('.image-lightbox__image');
  const caption = overlay.querySelector('.image-lightbox__caption');
  const closeButton = overlay.querySelector('.image-lightbox__close');
  let previousFocus = null;

  const open = (img) => {
    previousFocus = document.activeElement;
    largeImage.src = img.currentSrc || img.src;
    largeImage.alt = img.alt || '';

    const figureCaption = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
    const captionText = figureCaption || img.alt || '';
    caption.textContent = captionText;
    caption.hidden = !captionText;

    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    largeImage.removeAttribute('src');
    previousFocus?.focus?.();
  };

  images.forEach((img) => {
    img.classList.add('lightbox-enabled');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${img.alt || 'Изображение'}. Открыть крупнее`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(img);
      }
    });
  });

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
})();
