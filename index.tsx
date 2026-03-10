import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import "mobile-drag-drop/default.css";

// Initialize mobile drag and drop polyfill
polyfill({
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

window.addEventListener('touchmove', function() {}, {passive: false});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);