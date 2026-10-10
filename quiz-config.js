// Shared quiz config helpers: used by main.html (script.js), admin.html (admin.js) and server.js.
// Loaded as a classic <script> in the browser (functions become globals) and via require() in Node.

/** @typedef {{ id: string, label: string, imageSrc?: string, description?: string }} Outcome */
/** @typedef {{ id: string, text: string, outcomeId: string }} Answer */
/** @typedef {{ id: string, prompt: string, answers: Answer[] }} Question */
/** @typedef {{ meta: { title: string, subtitle?: string, landingText?: string }, outcomes: Outcome[], questions: Question[] }} QuizConfig */

/** @returns {QuizConfig} */
function defaultConfig() {
  return {
    meta: { title: "Descoperă care este super puterea ta EDU!", subtitle: "", landingText: "" },
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

/**
 * Validates and cleans a config. Drops malformed or duplicate entries.
 * Returns null if the result would not be a playable quiz.
 * @param {any} config
 * @returns {QuizConfig | null}
 */
function normalizeConfig(config) {
  try {
    if (!config || typeof config !== "object") return null;
    const meta = config.meta && typeof config.meta === "object" ? config.meta : {};
    const title = isNonEmptyString(meta.title) ? meta.title : "Quiz";
    const subtitle = typeof meta.subtitle === "string" ? meta.subtitle : "";
    const landingText = typeof meta.landingText === "string" ? meta.landingText : "";

    const outcomeIds = new Set();
    const outcomes = (Array.isArray(config.outcomes) ? config.outcomes : [])
      .filter((o) => o && typeof o === "object" && isNonEmptyString(o.id) && isNonEmptyString(o.label))
      .filter((o) => !outcomeIds.has(o.id) && outcomeIds.add(o.id))
      .map((o) => ({
        id: String(o.id),
        label: String(o.label),
        imageSrc: typeof o.imageSrc === "string" ? o.imageSrc : "",
        description: typeof o.description === "string" ? o.description : "",
      }));
    if (outcomes.length === 0) return null;

    const questionIds = new Set();
    const questions = (Array.isArray(config.questions) ? config.questions : [])
      .filter((q) => q && typeof q === "object" && isNonEmptyString(q.id) && isNonEmptyString(q.prompt) && Array.isArray(q.answers))
      .filter((q) => !questionIds.has(q.id) && questionIds.add(q.id))
      .map((q) => {
        const answerIds = new Set();
        const answers = q.answers
          .filter((a) => a && typeof a === "object" && isNonEmptyString(a.id) && isNonEmptyString(a.text) && isNonEmptyString(a.outcomeId))
          .filter((a) => outcomeIds.has(a.outcomeId))
          .filter((a) => !answerIds.has(a.id) && answerIds.add(a.id))
          .map((a) => ({ id: String(a.id), text: String(a.text), outcomeId: String(a.outcomeId) }));
        return { id: String(q.id), prompt: String(q.prompt), answers };
      })
      .filter((q) => q.answers.length >= 2);
    if (questions.length === 0) return null;

    return { meta: { title, subtitle, landingText }, outcomes, questions };
  } catch {
    return null;
  }
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

/** Safely embeds a string as a JS argument inside a double-quoted inline handler (onclick="fn(...)"). */
function jsArg(s) {
  return escapeHtml(JSON.stringify(String(s)));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { defaultConfig, normalizeConfig, isNonEmptyString, escapeHtml, escapeAttr, jsArg };
}
