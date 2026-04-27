import React from 'react';
import { renderToString } from 'react-dom/server';
import CounterfactualSimulator from './src/screens/CounterfactualSimulator.jsx';

function triggerToast() {}

try {
  const html = renderToString(<CounterfactualSimulator triggerToast={triggerToast} />);
  console.log("Render successful. HTML length:", html.length);
} catch (e) {
  console.error("Render failed:", e);
}
