const form = document.getElementById("form")

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = e.target.title.value;
  const image = e.target.image.value;
  const html = e.target.html.value;

  chrome.storage.sync.set({ title, image, html })
  chrome.runtime.sendMessage({ title, image, html })
})

chrome.storage.sync.get(["title", "image", "html"], data => {
  const { title, image, html } = data;
  form.title.value = title || "";
  form.image.value = image || "";
  form.html.value = html || "";
})