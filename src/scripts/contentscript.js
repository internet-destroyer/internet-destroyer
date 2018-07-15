import ext from "./utils/ext";

var extractTags = () => {
  var url = document.location.href;
  if (!url || !url.match(/^http/)) return;

  var data = {
    title: "",
    description: "",
    url: document.location.href
  };

  var ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    data.title = ogTitle.getAttribute("content");
  } else {
    data.title = document.title;
  }

  var descriptionTag =
    document.querySelector("meta[property='og:description']") ||
    document.querySelector("meta[name='description']");
  if (descriptionTag) {
    data.description = descriptionTag.getAttribute("content");
  }

  return data;
};

function onRequest(request, sender, sendResponse) {
  if (request.action === "process-page") {
    sendResponse(extractTags());
  }
}

function loadScript(script, callback = () => false) {
  var s = document.createElement("script");
  s.src = ext.extension.getURL(script);
  s.onload = function() {
    callback();
  };
  (document.head || document.documentElement).appendChild(s);
}

ext.runtime.onMessage.addListener(onRequest);
loadScript("scripts/jquery.js", () => loadScript("scripts/inject.js"));
