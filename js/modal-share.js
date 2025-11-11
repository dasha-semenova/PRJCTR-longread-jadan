document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('shareButton');
  const modal = document.querySelector('[data-modal]');
  const closeModal = document.querySelector('[data-close]');
  const shareLinks = document.querySelectorAll('.share-link');

  if (!shareButton || !modal) return; // защита от ошибок

  const pageUrl = window.location.href;
  const pageTitle = document.title;

  // Открытие модалки
  shareButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
  });

  // Закрытие крестиком
  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Закрытие кликом по фону
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Клики по иконкам
  shareLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.dataset.share;
      let shareUrl = '';

      switch (type) {
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
          break;
        case 'viber':
          shareUrl = `viber://forward?text=${encodeURIComponent(pageUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(pageUrl)}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(pageUrl)
            .then(() => alert('Ссылка скопирована!'))
            .catch(() => alert('Не удалось скопировать ссылку'));
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank');
        modal.classList.remove('active');
      }
    });
  });
});
