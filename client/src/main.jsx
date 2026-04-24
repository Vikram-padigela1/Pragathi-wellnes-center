import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
const ogImage =
  import.meta.env.VITE_PUBLIC_OG_IMAGE ||
  `${window.location.origin}/assets/logo.jpg`;

const canonicalLink = document.getElementById("canonical-url");
const ogUrlMeta = document.getElementById("og-url");
const ogImageMeta = document.getElementById("og-image");

if (canonicalLink) {
  canonicalLink.setAttribute("href", publicSiteUrl);
}

if (ogUrlMeta) {
  ogUrlMeta.setAttribute("content", publicSiteUrl);
}

if (ogImageMeta) {
  ogImageMeta.setAttribute("content", ogImage);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
