// Requires quiz-config.js (defaultConfig, normalizeConfig, isNonEmptyString, escapeHtml, jsArg).
const STORAGE_KEY = "eduquiz:config:v1";
const API_CONFIG_URL = "/api/config";

/** @returns {QuizConfig} */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    return normalizeConfig(JSON.parse(raw)) || defaultConfig();
  } catch {
    return defaultConfig();
  }
}

/** @param {QuizConfig} config */
function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // storage full or blocked; the cache is optional
  }
}

let config = loadConfig();
let quizStarted = false;
let currentQuestion = 0;
/** @type {(string | null)[]} */
let selections = [];
/** @type {Record<string, number>} */
let scores = {};

function resetRunState() {
  currentQuestion = 0;
  selections = new Array(config.questions.length).fill(null);
  scores = Object.fromEntries(config.outcomes.map((o) => [o.id, 0]));
}

resetRunState();

async function loadConfigFromServer() {
  try {
    const res = await fetch(API_CONFIG_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    const normalized = normalizeConfig(await res.json());
    if (!normalized) throw new Error("invalid config");
    saveConfig(normalized); // local cache
    // Don't swap questions under someone who already started answering.
    if (!quizStarted) {
      config = normalized;
      resetRunState();
    }
  } catch {
    // keep local cache/default (e.g. on GitHub Pages there is no /api)
  }
  syncLandingMeta();
}

function fadeOut(element, callback) {
  element.classList.add("hidden-opacity");
  setTimeout(() => {
    if (callback) callback();
  }, 500);
}

function fadeIn(element) {
  element.classList.remove("hidden-opacity");
}

function startQuiz() {
  const landing = document.getElementById("landing");
  const quiz = document.getElementById("quiz");
  quizStarted = true;
  fadeOut(landing, () => {
    landing.classList.add("hidden");
    resetRunState();
    showQuestion();
    quiz.classList.remove("hidden");
  });
}

function showQuestion() {
  const q = config.questions[currentQuestion];
  const container = document.getElementById("question-container");
  const selectedAnswerId = selections[currentQuestion];

  fadeOut(container, () => {
    container.innerHTML = `
      <p class="text-sm text-gray-600 mb-1">Întrebarea ${currentQuestion + 1} din ${config.questions.length}</p>
      <h2 class="text-xl font-bold mb-4">${escapeHtml(q.prompt)}</h2>
      <div class="space-y-3">
        ${q.answers
          .map(
            (a) => `
          <button type="button" onclick="selectAnswer(${jsArg(a.id)})"
                  class="block w-full bg-white border border-gray-300 px-4 py-3 rounded-xl transition-colors custom-hover ${a.id === selectedAnswerId ? "ring-2 ring-red-700" : ""}">
            ${escapeHtml(a.text)}
          </button>`
          )
          .join("")}
      </div>
    `;
    fadeIn(container);
  });

  document.getElementById("prev-btn").classList.toggle("hidden", currentQuestion === 0);
  updateProgressBar(currentQuestion);
}

function updateProgressBar(answered) {
  const total = config.questions.length || 1;
  document.getElementById("progress-bar").style.width = `${(answered / total) * 100}%`;
}

function applySelection(qIndex, newAnswerId) {
  const q = config.questions[qIndex];
  if (!q) return;
  const prevAnswerId = selections[qIndex];
  if (prevAnswerId) {
    const prev = q.answers.find((a) => a.id === prevAnswerId);
    if (prev && typeof scores[prev.outcomeId] === "number") scores[prev.outcomeId] -= 1;
  }
  const next = q.answers.find((a) => a.id === newAnswerId);
  if (next && typeof scores[next.outcomeId] === "number") scores[next.outcomeId] += 1;
  selections[qIndex] = newAnswerId;
}

function selectAnswer(answerId) {
  applySelection(currentQuestion, answerId);
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < config.questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

/** Highest score wins; ties go to the outcome listed first in the config. */
function pickWinner() {
  let winner = config.outcomes[0];
  for (const o of config.outcomes) {
    if ((scores[o.id] || 0) > (scores[winner.id] || 0)) winner = o;
  }
  return winner;
}

function showResults() {
  const quiz = document.getElementById("quiz");
  const results = document.getElementById("results");
  const resultImage = document.getElementById("result-image");
  updateProgressBar(config.questions.length);

  fadeOut(document.getElementById("question-container"), () => {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    const winner = pickWinner();
    document.getElementById("result-label").textContent = winner.label;
    resultImage.classList.toggle("hidden", !winner.imageSrc);
    if (winner.imageSrc) {
      resultImage.src = winner.imageSrc;
      resultImage.alt = winner.label;
    }
    document.getElementById("result-text").textContent = winner.description || "";
    fadeIn(results);
  });
}

function restartQuiz() {
  const results = document.getElementById("results");
  const landing = document.getElementById("landing");
  quizStarted = false;

  fadeOut(results, () => {
    results.classList.add("hidden");
    resetRunState();
    updateProgressBar(0);
    landing.classList.remove("hidden");
    fadeIn(landing);
    // Pick up any config changes made while this run was in progress.
    loadConfigFromServer();
  });
}

function syncLandingMeta() {
  const landing = document.getElementById("landing");
  if (!landing) return;
  const h1 = landing.querySelector("h1");
  if (h1) h1.textContent = config.meta.title || h1.textContent;
  const subtitleEl = document.getElementById("landing-subtitle");
  if (subtitleEl) {
    subtitleEl.textContent = config.meta.subtitle || "";
    subtitleEl.classList.toggle("hidden", !isNonEmptyString(config.meta.subtitle || ""));
  }

  const box = document.getElementById("landing-textbox");
  const boxContent = document.getElementById("landing-textbox-content");
  const text = typeof config.meta.landingText === "string" ? config.meta.landingText : "";
  if (boxContent) boxContent.textContent = text;
  if (box) box.classList.toggle("hidden", !isNonEmptyString(text));
}

document.addEventListener("DOMContentLoaded", () => {
  syncLandingMeta();
  loadConfigFromServer();
});
