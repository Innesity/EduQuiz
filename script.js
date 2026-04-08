const STORAGE_KEY = "eduquiz:config:v1";
const API_CONFIG_URL = "/api/config";

/** @typedef {{ id: string, label: string, imageSrc?: string, description?: string }} Outcome */
/** @typedef {{ id: string, text: string, outcomeId: string }} Answer */
/** @typedef {{ id: string, prompt: string, answers: Answer[] }} Question */
/** @typedef {{ meta: { title: string, subtitle?: string, landingText?: string }, outcomes: Outcome[], questions: Question[] }} QuizConfig */

/** @returns {QuizConfig} */
function defaultConfig() {
  return {
    meta: {
      title: "Descoperă care este super puterea ta EDU!",
      subtitle: "",
      landingText: "",
    },
    outcomes: [
      {
        id: "reprezentare",
        label: "Reprezentare",
        imageSrc: "REPREZENTARE.png",
        description:
          "🔴 Ajută la comunicarea cu șefii de an și șefii de subgrupă\n🔴 Facilitează comunicarea dintre studenți și Conducerea Facultății\n🔴 Centralizează problemele sesizate de studenți",
      },
      {
        id: "consiliere",
        label: "Consiliere",
        imageSrc: "CONSILIERE.png",
        description:
          "🔵 Monitorizează grupurile de an de WhatsApp\n🔵 Răspunde la întrebările studenților venite pe pagina Ligii și pe grupurile de an\n🔵 Identifică nevoile studenților și ia măsuri pentru a le îndeplini",
      },
      {
        id: "informare",
        label: "Informare",
        imageSrc: "INFORMARE.png",
        description:
          "🟣 Se ocupă cu generarea de conținut edu pentru articole / emailuri de pe Campus Virtual / postări ale Ligii\n🟣 Ajută studenții să descopere oportunități educaționale\n🟣 Realizează sesiuni de informare(întâlniri) cu studenții",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "Care dintre aceste opțiuni te reprezintă cel mai bine?",
        answers: [
          { id: "q1a1", text: "Să transmiți informații clar și organizat", outcomeId: "informare" },
          { id: "q1a2", text: "Să vorbești și să reprezinți grupul", outcomeId: "reprezentare" },
          { id: "q1a3", text: "Să asculți și să ajuți oamenii", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q2",
        prompt: "Dacă ai fi super-erou, ai vrea să ai puterea de…",
        answers: [
          { id: "q2a1", text: "A liniști și încuraja", outcomeId: "consiliere" },
          { id: "q2a2", text: "A inspira mulțimi", outcomeId: "reprezentare" },
          { id: "q2a3", text: "A face mesajele clare și vizibile pentru toată lumea", outcomeId: "informare" },
        ],
      },
      {
        id: "q3",
        prompt: "Ce compliment te-ar face cel mai fericit?",
        answers: [
          { id: "q3a1", text: "„Datorită ție, anul nostru a rezolvat în sfârșit acea problemă.”", outcomeId: "reprezentare" },
          { id: "q3a2", text: "„Ești mereu acolo să ne ajuți când suntem pierduți.”", outcomeId: "consiliere" },
          { id: "q3a3", text: "„Postările tale mă învață întotdeauna ceva nou.”", outcomeId: "informare" },
        ],
      },
      {
        id: "q4",
        prompt: "Care întâlnire ți-ar plăcea cel mai mult?",
        answers: [
          { id: "q4a1", text: "Orientare pentru studenții din primul an", outcomeId: "consiliere" },
          { id: "q4a2", text: "Workshop despre tehnici de învățare", outcomeId: "informare" },
          { id: "q4a3", text: "Ședință a Consiliului Facultății despre modificări de curriculum", outcomeId: "reprezentare" },
        ],
      },
      {
        id: "q5",
        prompt: "Ce ai corecta prima dată dacă ai avea bagheta magică?",
        answers: [
          {
            id: "q5a1",
            text: "Să faci facultatea să asculte și să acționeze mai rapid la nevoile studenților",
            outcomeId: "reprezentare",
          },
          { id: "q5a2", text: "Să fie toate informațiile disponibile într-un loc clar și accesibil", outcomeId: "informare" },
          { id: "q5a3", text: "Să nu mai existe niciun student pierdut sau nesprijinit", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q6",
        prompt: "Primești un anunț de la facultate. Care este reacția ta?",
        answers: [
          { id: "q6a1", text: "Oferi să răspunzi întrebărilor studenților care nu au înțeles", outcomeId: "consiliere" },
          {
            id: "q6a2",
            text: "Distribui mesajul către șefii de an pentru a te asigura că toți primesc informația",
            outcomeId: "reprezentare",
          },
          { id: "q6a3", text: "Rescrii clar anunțul pentru studenți și îl postezi online", outcomeId: "informare" },
        ],
      },
      {
        id: "q7",
        prompt: "Care sarcină ți se pare cea mai interesantă?",
        answers: [
          { id: "q7a1", text: "Colectarea feedback-ului studenților despre desfășurarea unui examen", outcomeId: "reprezentare" },
          { id: "q7a2", text: "Moderarea grupurilor WhatsApp și asigurarea că toată lumea se simte sprijinită", outcomeId: "consiliere" },
          { id: "q7a3", text: "Crearea unei postări despre oportunități Erasmus și distribuirea ei online", outcomeId: "informare" },
        ],
      },
      {
        id: "q8",
        prompt: "Ce proiect ai alege să conduci?",
        answers: [
          { id: "q8a1", text: "Crearea unui newsletter despre burse, workshop-uri și internship-uri", outcomeId: "informare" },
          {
            id: "q8a2",
            text: "Colaborarea cu liderii de an pentru a realiza un raport formal privind problemele cursurilor",
            outcomeId: "reprezentare",
          },
          { id: "q8a3", text: "Organizarea unui eveniment de integrare pentru studenții noi", outcomeId: "consiliere" },
        ],
      },
      {
        id: "q9",
        prompt: "Când lucrezi cu alții, preferi să…",
        answers: [
          { id: "q9a1", text: "Îi ajuți pe rând și răspunzi cu răbdare la întrebările lor", outcomeId: "consiliere" },
          { id: "q9a2", text: "Pregătești materialele astfel încât să aibă totul disponibil de la început", outcomeId: "informare" },
          { id: "q9a3", text: "Reprezinți grupul în întâlniri și vorbești în numele lor", outcomeId: "reprezentare" },
        ],
      },
    ],
  };
}

/** @param {any} v */
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/** @param {any} config @returns {QuizConfig | null} */
function normalizeConfig(config) {
  try {
    if (!config || typeof config !== "object") return null;
    const meta = config.meta && typeof config.meta === "object" ? config.meta : {};
    const title = isNonEmptyString(meta.title) ? meta.title : "Quiz";
    const subtitle = typeof meta.subtitle === "string" ? meta.subtitle : "";
    const landingText = typeof meta.landingText === "string" ? meta.landingText : "";

    const outcomesRaw = Array.isArray(config.outcomes) ? config.outcomes : [];
    const outcomes = outcomesRaw
      .filter((o) => o && typeof o === "object" && isNonEmptyString(o.id) && isNonEmptyString(o.label))
      .map((o) => ({
        id: String(o.id),
        label: String(o.label),
        imageSrc: typeof o.imageSrc === "string" ? o.imageSrc : "",
        description: typeof o.description === "string" ? o.description : "",
      }));
    if (outcomes.length === 0) return null;
    const outcomeIds = new Set(outcomes.map((o) => o.id));

    const questionsRaw = Array.isArray(config.questions) ? config.questions : [];
    const questions = questionsRaw
      .filter((q) => q && typeof q === "object" && isNonEmptyString(q.id) && isNonEmptyString(q.prompt) && Array.isArray(q.answers))
      .map((q) => {
        const answers = q.answers
          .filter((a) => a && typeof a === "object" && isNonEmptyString(a.id) && isNonEmptyString(a.text) && isNonEmptyString(a.outcomeId))
          .map((a) => ({ id: String(a.id), text: String(a.text), outcomeId: String(a.outcomeId) }))
          .filter((a) => outcomeIds.has(a.outcomeId));
        return { id: String(q.id), prompt: String(q.prompt), answers };
      })
      .filter((q) => q.answers.length >= 2);

    if (questions.length === 0) return null;

    return {
      meta: { title, subtitle, landingText },
      outcomes,
      questions,
    };
  } catch {
    return null;
  }
}

/** @returns {QuizConfig} */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw);
    return normalizeConfig(parsed) || defaultConfig();
  } catch {
    return defaultConfig();
  }
}

/** @param {QuizConfig} config */
function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config, null, 2));
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

let config = loadConfig();
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
    const parsed = await res.json();
    const normalized = normalizeConfig(parsed);
    if (!normalized) throw new Error("invalid config");
    config = normalized;
    saveConfig(config); // local cache
    resetRunState();
    syncLandingMeta();
  } catch {
    // keep local cache/default
    syncLandingMeta();
  }
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
  fadeOut(landing, () => {
    landing.classList.add("hidden");
    resetRunState();
    showQuestion();
    quiz.classList.remove("hidden");
    fadeIn(document.getElementById("question-container"));
  });
}

function showQuestion() {
  const q = config.questions[currentQuestion];
  const container = document.getElementById("question-container");
  const selectedAnswerId = selections[currentQuestion];
  
  fadeOut(container, () => {
    container.innerHTML = `
      <h2 class="text-xl font-bold mb-4">${q.prompt}</h2>
      <div class="space-y-3">
        ${q.answers.map(a => `
          <button onclick="selectAnswer('${a.id}')" 
                  class="block w-full bg-white border border-gray-300 px-4 py-3 rounded-xl transition-colors custom-hover ${a.id === selectedAnswerId ? 'ring-2 ring-red-700' : ''}">
            ${a.text}
          </button>`).join('')}
      </div>
    `;
    fadeIn(container);
  });

  document.getElementById("prev-btn").classList.toggle("hidden", currentQuestion === 0);
  updateProgressBar();
}

function updateProgressBar() {
  const total = config.questions.length || 1;
  const progress = (currentQuestion / total) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
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

function showResults() {
  const quiz = document.getElementById("quiz");
  const results = document.getElementById("results");
  const resultImage = document.getElementById("result-image");
  
  fadeOut(document.getElementById("question-container"), () => {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    const winnerId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || config.outcomes[0].id;
    const winner = config.outcomes.find((o) => o.id === winnerId) || config.outcomes[0];
    resultImage.src = winner.imageSrc || "images/default-team.png";
    document.getElementById("result-text").innerText = winner.description || winner.label;
    fadeIn(results);
  });
}

function restartQuiz() {
  resetRunState();
  showQuestion();
  const results = document.getElementById("results");
  const landing = document.getElementById("landing");
  
  fadeOut(results, () => {
    results.classList.add("hidden");
    landing.classList.remove("hidden");
    fadeIn(landing);
    document.getElementById("progress-bar").style.width = "0%";
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("\n", " ");
}

// Initialize landing title with config meta (best-effort: keep existing DOM structure)
document.addEventListener("DOMContentLoaded", () => {
  try {
    loadConfigFromServer();
  } catch {
    // ignore
  }
});

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
