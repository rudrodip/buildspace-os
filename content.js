function injectImage(imageUrl) {
  const videoContainer = document.querySelector('div.framer-39t0w6-container');
  if (videoContainer) {
    videoContainer.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; object-position: center center;" />`;
    return true;
  }
  return false;
}

function injectVideo(videoUrl, autoplay = "", loop = "", muted = "", controls = "") {
  const youtubeVideoId = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  const videoContainer = document.querySelector('div.framer-39t0w6-container');
  if (videoContainer) {
    if (youtubeVideoId) {
      let content = `<iframe src="https://www.youtube.com/embed/${youtubeVideoId[1]}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}${loop ? `&playlist=${youtubeVideoId}` : ""}" style="width: 100%; height: 100%; object-fit: cover; object-position: center center;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />`;
      videoContainer.innerHTML = content;
      return true;
    }
    videoContainer.innerHTML = `<video src="${videoUrl}" ${autoplay} ${loop} ${muted} ${controls} style="width: 100%; height: 100%; object-fit: cover; object-position: center center;" />`;
    return true;
  }
  return false;
}

function injectHtml(html) {
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

  new Promise((resolve) => {
    chrome.storage.sync.get('image', (data) => {
      const imageUrl = data.image;
      if (imageUrl && imageUrl.trim() !== '') {
        if (!injectImage(imageUrl)) {
          const observer = new MutationObserver((mutations, obs) => {
            if (injectImage(imageUrl)) {
              obs.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
      resolve();
    });
  })
  .then(() => {
    return new Promise((resolve) => {
      chrome.storage.sync.get('video', (data) => {
        const videoUrl = data.video;
      
        Promise.all([
          new Promise((resolve) => chrome.storage.sync.get('autoplay', (data) => resolve(data.autoplay))),
          new Promise((resolve) => chrome.storage.sync.get('loop', (data) => resolve(data.loop))),
          new Promise((resolve) => chrome.storage.sync.get('muted', (data) => resolve(data.muted))),
          new Promise((resolve) => chrome.storage.sync.get('controls', (data) => resolve(data.controls)))
        ]).then(([autoplay, loop, muted, controls]) => {
          if (videoUrl && videoUrl.trim() !== '') {
            if (!injectVideo(videoUrl, autoplay, loop, muted, controls)) {
              const observer = new MutationObserver((mutations, obs) => {
                if (injectVideo(videoUrl, autoplay, loop, muted, controls)) {
                  obs.disconnect();
                }
              });
              observer.observe(document.body, { childList: true, subtree: true });
            }
          }
          resolve();
        });
      });
    });
  })
  .then(() => {
    chrome.storage.sync.get('html', (data) => {
      const html = data.html;
      if (html && html.trim() !== ''){
        if (!injectHtml(html)) {
          const observer = new MutationObserver((mutations, obs) => {
            if (injectHtml(html)) {
              obs.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
    });
  });
}

chrome.storage.onChanged.addListener(init);
chrome.runtime.onMessage.addListener((message) => {
  init();
  const { title, image, video, html } = message;
  ((!image && !html && !video) || !title) && location.reload();
});

window.addEventListener('load', init, false);
