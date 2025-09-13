// === OpenAI API Integration ===
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // <-- Replace with your real API key
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function fetchOpenAIChat(messages, systemPrompt = null) {
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      ...(systemPrompt ? [{role: 'system', content: systemPrompt}] : []),
      ...messages
    ],
    max_tokens: 256,
    temperature: 0.7
  };
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('OpenAI API error');
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// AI Chatbot UI logic
const aiChatbotToggle = document.getElementById('ai-chatbot-toggle');
const aiChatbotPanel = document.getElementById('ai-chatbot-panel');
const aiChatbotClose = document.getElementById('ai-chatbot-close');
const aiChatbotForm = document.getElementById('ai-chatbot-form');
const aiChatbotInput = document.getElementById('ai-chatbot-input');
const aiChatbotMessages = document.getElementById('ai-chatbot-messages');

aiChatbotToggle.onclick = () => aiChatbotPanel.style.display = 'block';
aiChatbotClose.onclick = () => aiChatbotPanel.style.display = 'none';
aiChatbotForm.onsubmit = async (e) => {
  e.preventDefault();
  const msg = aiChatbotInput.value.trim();
  if (!msg) return;
  aiChatbotMessages.innerHTML += `<div class='ai-user-msg'>${msg}</div>`;
  aiChatbotInput.value = '';
  aiChatbotMessages.innerHTML += `<div class='ai-bot-msg ai-loading'>[AI is typing...]</div>`;
  aiChatbotMessages.scrollTop = aiChatbotMessages.scrollHeight;
  try {
    const reply = await fetchOpenAIChat([
      {role: 'user', content: msg}
    ], 'You are an AI assistant for a software testing portfolio website.');
    aiChatbotMessages.querySelector('.ai-loading').remove();
    aiChatbotMessages.innerHTML += `<div class='ai-bot-msg'>${reply}</div>`;
    aiChatbotMessages.scrollTop = aiChatbotMessages.scrollHeight;
  } catch (err) {
    aiChatbotMessages.querySelector('.ai-loading').remove();
    aiChatbotMessages.innerHTML += `<div class='ai-bot-msg'>[AI]: Error connecting to OpenAI API.</div>`;
  }
};

// Smart Project Recommender
const aiRecommendBtn = document.getElementById('ai-recommend-btn');
const aiRecommendation = document.getElementById('ai-recommendation');
aiRecommendBtn.onclick = () => {
  aiRecommendation.innerHTML = '<b>AI Suggests:</b> Check out the "Advance — Bankist (DOM)" project for a great example of automation!';
};

// AI Skills Visualization (placeholder)
document.getElementById('ai-skills-graph').innerHTML = '<em>[Imagine a dynamic skills graph here!]</em>';

// AI Summary Button (uses OpenAI)
const aiSummaryBtn = document.getElementById('ai-summary-btn');
aiSummaryBtn.onclick = async () => {
  aiSummaryBtn.disabled = true;
  aiSummaryBtn.textContent = 'Summarizing...';
  try {
    const expText = `Cognizant Technology Solutions: Architected hybrid automation frameworks using Selenium & TestNG, introduced data-driven patterns and parallel execution to cut regression time ~30%. Built REST API test suites using RestAssured including contract/negative tests. Led UiPath bot validations (Studio & Orchestrator) and integrated SQL-based end-to-end checks. Improved release confidence and reduced manual regression effort across 10+ healthcare apps. Bytexus Software Solutions: Built front-end features in React, improved UI performance, and added integration tests for API endpoints. Cognizant Technology Solutions (Intern): Executed automation & manual test cases for claims processing. Performed DB validations and coordinated release verification.`;
    const summary = await fetchOpenAIChat([
      {role: 'user', content: `Summarize this experience in 2 lines for a portfolio: ${expText}`}
    ]);
    alert('AI Summary: ' + summary);
  } catch (err) {
    alert('AI Summary: Error connecting to OpenAI API.');
  }
  aiSummaryBtn.disabled = false;
  aiSummaryBtn.textContent = 'AI Summary';
};

// Semantic Search Bar (uses OpenAI)
const aiSearchForm = document.getElementById('ai-search-form');
const aiSearchInput = document.getElementById('ai-search-input');
const aiSearchResults = document.getElementById('ai-search-results');
aiSearchForm.onsubmit = async (e) => {
  e.preventDefault();
  const query = aiSearchInput.value.trim();
  if (!query) return;
  aiSearchResults.innerHTML = `<div class='ai-bot-msg ai-loading'>[AI is searching...]</div>`;
  try {
    const siteContext = `Portfolio sections: About: SDET with 3 years experience in Automation, API, RPA. Experience: Cognizant, Bytexus, automation, React, API testing. Projects: Advance Bankist, PlayWithText, Invoice Bot. Skills: Selenium, TestNG, RestAssured, UiPath, SQL, Java, JavaScript, Azure DevOps, Jenkins, JIRA.`;
    const result = await fetchOpenAIChat([
      {role: 'user', content: `Given this portfolio context: ${siteContext}\nAnswer this user query: ${query}`}
    ]);
    aiSearchResults.innerHTML = `<div class='ai-bot-msg'>${result}</div>`;
  } catch (err) {
    aiSearchResults.innerHTML = `<div class='ai-bot-msg'>[AI]: Error connecting to OpenAI API.</div>`;
  }
};

// Placeholders for AI Extras
['ai-voice-btn','ai-testimonials-btn','ai-resume-analyzer-btn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.onclick = () => alert('This AI feature is coming soon!');
});