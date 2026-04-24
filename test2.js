import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAKdk7IKqN3TgR85Mbybf9FUMZNKoRnRHE");

async function run() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAKdk7IKqN3TgR85Mbybf9FUMZNKoRnRHE");
    const data = await response.json();
    console.log(data.models.map(m => m.name));
  } catch (e) {
    console.error(e.message);
  }
}

run();
