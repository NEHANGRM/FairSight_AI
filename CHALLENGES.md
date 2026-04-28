# Challenges Faced

Building a production-grade AI Bias Firewall prototype for the Google Solution Challenge presented several significant technical and design hurdles.

## 1. Zero-Latency Illusion for UI/UX
**The Challenge:** A firewall must act in real-time. If the dashboard feels sluggish, the illusion of a high-performance interceptor is broken.
**The Solution:** We abandoned heavy charting libraries (like Chart.js or Recharts) which often introduce render blocking and bloated bundle sizes. Instead, we custom-built every visual element—from the Bias Heatmap to the Retraining Loop visualizer—using raw SVGs and React state. This resulted in a near-instantaneous render cycle.

## 2. Gemini API Quota Limits During Development
**The Challenge:** While implementing the real-time AI Fairness Auditor, we encountered strict `Limit: 0` quota restrictions on our Google Cloud free-tier accounts for the newest `gemini-2.0-flash` models.
**The Solution:** We successfully upgraded to the **`gemini-2.5-flash-lite`** model, which provides a more stable free-tier quota while maintaining the sub-second reasoning capabilities required for a real-time firewall. 

## 3. Securing Generative AI Credentials
**The Challenge:** Calling AI APIs directly from a React frontend exposes the API key to anyone who opens the browser's developer tools. For a security-focused product like EQUA, this was an unacceptable risk.
**The Solution:** We re-architected the entire application to a **Backend-for-Frontend (BFF)** pattern. We built a containerized Express.js backend on **Google Cloud Run** to act as a secure proxy. The frontend now communicates with our backend, and the Gemini API key remains safely hidden in the server-side environment. This transition significantly increased the production maturity and security score of our solution.

## 4. Designing for the EU AI Act
**The Challenge:** AI fairness is highly abstract. We needed a way to make compliance visual and actionable.
**The Solution:** We implemented a real-time **Fairness Registry** using **Firebase Realtime Database**. By logging every blocked decision with a Gemini-generated audit narrative, we created a tangible, queryable audit trail that satisfies the "Right to Explanation" and "Accountability" requirements of modern AI legislation.

## 5. Tailwind v4 and PostCSS Integration
**The Challenge:** Adopting the bleeding-edge Tailwind v4 required restructuring how we handled CSS imports, as it conflicts with traditional PostCSS setups if `@import` statements for fonts are not placed correctly.
**The Solution:** We refactored `index.css` to strictly adhere to PostCSS rules, ensuring Google Fonts were loaded before the core Tailwind directive, eliminating silent build failures.

## 6. Vertex AI Simulation Strategy
**The Challenge:** Connecting to live Vertex AI AutoML endpoints for every demo run can be cost-prohibitive and requires extensive dataset preparation for a hackathon prototype.
**The Solution:** We made a strategic decision to **simulate** the Vertex AI prediction scoring logic. By using deterministic baseline and counterfactual scores, we can showcase the entire EQUA firewall logic—including the sub-second Gemini AI audit and real-time Firebase logging—without the overhead of managing live ML endpoints. This ensures the prototype is 100% reliable for judges while maintaining a production-ready architecture.
