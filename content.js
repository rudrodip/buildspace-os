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

function setTitle(title) {
  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleElement.textContent = title;
  }
}

function init() {
  chrome.storage.sync.get('title', (data) => {
    const title = data.title;
    if (title && title.trim() !== ''){
      setTitle(title);
    }
  });

  chrome.storage.sync.get('image', (data) => {
    const imageUrl = data.image;
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
    if (html && html.trim() !== ''){
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

chrome.storage.onChanged.addListener(init);
chrome.runtime.onMessage.addListener((message) => {
  init();
  const { title, image, html } = message;
  ((!image && !html) || !title) && location.reload();
});

window.addEventListener('load', init, false);
