const form = document.getElementById("form")

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = e.target.title.value;
  const image = e.target.image.value;
  const video = e.target.video.value;
  const autoplay = e.target.autoplay.checked && "autoplay";
  const loop = e.target.loop.checked && "loop";
  const muted = e.target.muted.checked && "muted";
  const controls = e.target.controls.checked && "controls";
  const html = e.target.html.value;
  
  chrome.storage.sync.set({ title, image, video, autoplay, loop, muted, controls, html })
  chrome.runtime.sendMessage({ title, image, video, autoplay, loop, muted, controls, html })
})

chrome.storage.sync.get(["title", "image", "video", "autoplay", "loop", "muted", "controls", "html"], data => {
  const { title, image, video, autoplay, loop, muted, controls, html } = data;
  form.title.value = title || "";
  form.image.value = image || "";
  form.video.value = video || "";
  form.autoplay.checked = autoplay ? true : false;
  form.loop.checked = loop ? true : false;
  form.muted.checked = muted ? true : false;
  form.controls.checked = controls ? true :false;
  form.html.value = html || "";
})

document.getElementById("refresh").addEventListener("click", () => {
  window.location.reload();
})


document.addEventListener("DOMContentLoaded", function () {
    var editor = CodeMirror.fromTextArea(document.getElementById("html"), {
        mode: "text/html",
        theme: "monokai",
        lineNumbers: true
    });
});
