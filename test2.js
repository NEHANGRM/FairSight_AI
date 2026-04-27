import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCVEcllNIxPAxQ4pv_LDFIyQLo4d7XYD4o');
const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash-lite'});

const prompt = `You are the EQUA AI Fairness Auditor. An AI decision was intercepted and blocked.
Applicant: Darnell Washington
Protected attribute swapped: Race
Original profile score: 91.4 (Approved)
Counterfactual profile score: 61.8 (Denied)
Decision Delta: -32.4

Write a concise, highly professional 2-paragraph audit explanation (max 65 words) explaining why the model rejected them purely based on the correlation with the swapped protected attribute 'Race'. Start the second paragraph exactly with "Remediation suggestion:" and provide a technical ML fix (e.g., removing a proxy variable, adding constraints). Do not use markdown bolding.`;

async function test() {
  try {
    const result = await model.generateContent(prompt);
    console.log('Response:', result.response.text());
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
