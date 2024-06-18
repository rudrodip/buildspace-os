function replaceVideo(imageUrl) {
  const videoContainer = document.querySelector('div.framer-39t0w6-container');
  if (videoContainer) {
    videoContainer.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; object-position: center center;" />`;
    return true;
  }
  return false;
}

function replaceHtml(html) {
  const videoContainer = document.querySelector('div.framer-39t0w6-container');
  if (videoContainer) {
    videoContainer.innerHTML = html;
    return true;
  }
  return false;
}

function init() {
  chrome.storage.sync.get('imageUrl', (data) => {
    const imageUrl = data.imageUrl;
    if (imageUrl == "default") {
      return;
    }
    if (imageUrl && imageUrl.trim() !== '') {
      if (!replaceVideo(imageUrl)) {
        const observer = new MutationObserver((mutations, obs) => {
          if (replaceVideo(imageUrl)) {
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  });

  chrome.storage.sync.get('html', (data) => {
    const html = data.html;
    if (html == "default") {
      return;
    }
    if (html) {
      if (!replaceHtml(html)) {
        const observer = new MutationObserver((mutations, obs) => {
          if (replaceHtml(html)) {
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.imageUrl?.newValue) {
    const imageUrl = changes.imageUrl.newValue;
    if (imageUrl == "default") {
      location.reload();
      return;
    }
    if (imageUrl && imageUrl.trim() !== '') {
      replaceVideo(imageUrl);
    }
  }

  if (area === 'sync' && changes.html?.newValue) {
    const html = changes.html.newValue;
    if (html == "default") {
      location.reload();
      return;
    }
    if (html) {
      replaceHtml(html);
    }
  }
});

window.addEventListener('load', init, false);
