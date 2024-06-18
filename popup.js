document.getElementById('save-button').addEventListener('click', () => {
  let imageUrl = document.getElementById('image-url').value;
  if (!imageUrl) {
      imageUrl = 'default';
  }
  chrome.storage.sync.set({ imageUrl: imageUrl });
});

document.getElementById('save-html').addEventListener('click', () => {
  let html = document.getElementById('custom-html').value;
  if (!html) {
      html = 'default';
  }
  chrome.storage.sync.set({ html: html });
});

chrome.storage.sync.get('imageUrl', (data) => {
  if (data.imageUrl && data.imageUrl !== "default") {
      document.getElementById('image-url').value = data.imageUrl;
  }
});

chrome.storage.sync.get('html', (data) => {
  if (data.html && data.html !== "default") {
      document.getElementById('custom-html').value = data.html;
  }
});