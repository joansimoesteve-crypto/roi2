document.getElementById("open").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab && tab.url ? tab.url : "";
  if (!/^https?:\/\//i.test(url)) return;
  const app = "https://TU-DOMINIO.vercel.app/?url=" + encodeURIComponent(url);
  chrome.tabs.create({ url: app });
  window.close();
});