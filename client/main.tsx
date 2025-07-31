import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { loadFonts } from "./contexts/ThemeContext";

// Load fonts on app initialization
loadFonts();

// Clean up corrupted Arabic characters in the entire DOM
const cleanupArabicChars = () => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent && node.textContent.includes('��')) {
      textNodes.push(node);
    }
  }

  textNodes.forEach(textNode => {
    if (textNode.textContent) {
      textNode.textContent = textNode.textContent
        .replace(/��/g, '')
        .replace(/ï»¿/g, '')
        // إصلاح كلمات محددة
        .replace(/مت��جر/g, 'متاجر')
        .replace(/��لسوداني/g, 'السوداني')
        .replace(/��لليلي/g, 'الليلي')
        .replace(/تفصيل��ة/g, 'تفصيلية')
        .replace(/��هنية/g, 'مهنية')
        .replace(/اعتماد ه��ا/g, 'اعتماد هذا')
        .replace(/له��تف/g, 'للهاتف')
        .replace(/��ودانية/g, 'سودانية')
        .replace(/من��لي/g, 'منزلي')
        .replace(/شام��ة/g, 'شاملة')
        .replace(/��شطة/g, 'نشطة');
    }
  });
};

// Run cleanup after DOM is loaded
document.addEventListener('DOMContentLoaded', cleanupArabicChars);
// Also run cleanup periodically for dynamic content
setInterval(cleanupArabicChars, 2000);

// Register service worker for better offline experience
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
